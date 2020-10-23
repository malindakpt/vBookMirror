import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import firebase from 'firebase';
import { Category } from '../../presentational/category/Category';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import {
  getDocsWithProps, addDoc, updateDoc, getDocWithId,
} from '../../../data/Store';
import { AppContext } from '../../../App';
import { ILesson } from '../../../interfaces/ILesson';
import { IUser } from '../../../interfaces/IUser';
import { ICourse } from '../../../interfaces/ICourse';
import classes from './Course.module.scss';
import { Payment } from '../../presentational/payment/Payment';
import { Util } from '../../../helper/util';
import { IPayment } from '../../../interfaces/IPayment';

export const Course: React.FC = () => {
  useBreadcrumb();

  const [selectedLessons, setSelectedLessons] = useState<{ [key: string]: boolean }>({});
  const [user, setUser] = useState<IUser>();
  const [total, setTotal] = useState(0);
  const { email, showSnackbar } = useContext(AppContext);

  const { courseId } = useParams<any>(); // Two routest for this page. Consider both when reading params
  const [lessons, setLessons] = useState<ILesson[]>([]);

  useEffect(() => {
    Promise.all([
      // Check the lessons paid by user
      getDocsWithProps<IUser[]>('users', { ownerEmail: email }),
      // All lessons related to courseId
      getDocsWithProps<ILesson[]>('lessons', { courseId }),
      // Find the lesson order of the course
      getDocWithId<ICourse>('courses', courseId),
    ]).then((result) => {
      const [users, lessons, course] = result;

      if (users && lessons && course) {
        const lessons4Course: ILesson[] = [];
        course?.lessons.forEach((lesId) => {
          const les = lessons.find((l) => l.id === lesId);
          if (les) {
            lessons4Course.push(les);
          } else {
            console.error('lesson not found', lesId);
          }
        });
        lessons?.filter((less) => course?.lessons.includes(less.id));
        setUser(users[0]);
        setLessons(lessons4Course);
      }
    });
    // eslint-disable-next-line
  }, [email, selectedLessons]);

  const isAccessible = (lesson: ILesson) => !lesson.price
    || user?.lessons.find((les) => les.id === lesson.id && les.watchedCount < lesson.watchCount);

  const handleSelectLesson = (lesson: ILesson) => {
    if (!isAccessible(lesson) && !email) {
      if (Util.invokeLogin) {
        Util.invokeLogin();
      }
    } else {
      const next: any = { ...selectedLessons };
      next[lesson.id] = !next[lesson.id];
      let total = 0;

      for (const les of lessons) {
        if (next[les.id] && les.price) {
          total += les.price;
        }
      }
      setSelectedLessons(next);
      setTotal(total);
    }
  };

  const resetPayments = () => {
    showSnackbar('Subscribed to lessons');
    setSelectedLessons({});
    setTotal(0);
  };

  const handlePaymentSuccess = async (amount: number, date: number) => {
    if (!email) return;

    const paymentRef = await addDoc<Omit<IPayment, 'id'>>('payment', { amount, date, ownerEmail: email });
    const isNewUser = user === null;
    // const usersWithEmail: IUser[] = await getDocsWithProps('users', { email }, {});
    if (!user) {
      setUser({
        id: '',
        ownerEmail: email,
        lessons: [],
      });
    }

    for (const [les, subscribed] of Object.entries(selectedLessons)) {
      if (subscribed) {
        const lesson = lessons.find((l) => l.id === les);
        if (lesson) {
            user?.lessons.push({
              id: les,
              paymentRef,
              watchedCount: 0,
            });
        }
        updateDoc('lessons', les, { subCount: firebase.firestore.FieldValue.increment(1) });
      }
    }

    if (isNewUser) {
      addDoc('users', user).then(() => {
        resetPayments();
      });
    } else if (user) { // this check is to fix ts issue below
      updateDoc('users', user.id, user).then(() => {
        resetPayments();
      });
    }
  };

  return (
    <div className="container">
      {total > 0 && (
        <div className={classes.purchase}>
          <div className={classes.box}>
            <span>
              {`Rs. ${total}.00`}
            </span>
            <Payment
              amount={total}
              email={email}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      )}
      {
        lessons?.map((lesson, idx) => {
          let status: 'yes' | 'no' | 'none' | undefined;
          if (lesson.price) {
            if (isAccessible(lesson)) {
              status = 'yes';
            } else {
              status = 'no';
            }
          } else {
            status = 'none';
          }

          return (
            <div
              onClick={() => handleSelectLesson(lesson)}
              key={idx}
              role="button"
              tabIndex={0}
              onKeyDown={() => handleSelectLesson(lesson)}
            >
              <Category
                id={lesson.id}
                key={idx}
                CategoryImg={OndemandVideoIcon}
                title1={`${lesson.topic}`}
                title2={`${lesson.description}`}
                navURL={isAccessible(lesson) ? `${courseId}/${lesson.id}` : `${courseId}`}
                isSelected={selectedLessons[lesson.id]}
                status={status}
              />
            </div>
          );
        })
      }
    </div>
  );
};
