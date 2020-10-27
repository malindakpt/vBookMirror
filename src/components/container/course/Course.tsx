import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import { Category } from '../../presentational/category/Category';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import {
  getDocsWithProps, addDoc, updateDoc, getDocWithId, Entity, addDocWithId,
} from '../../../data/Store';
import { AppContext } from '../../../App';
import { ILesson2, ILiveLesson, IVideoLesson } from '../../../interfaces/ILesson';
import { IUser } from '../../../interfaces/IUser';
import { ICourse } from '../../../interfaces/ICourse';
import { IPayment } from '../../../interfaces/IPayment';
import { AlertDialog } from '../../presentational/snackbar/AlertDialog';
import { paymentJS, startPay } from '../../../helper/payment';
import Config from '../../../data/Config';

export const Course: React.FC = () => {
  useBreadcrumb();

  const [user, setUser] = useState<IUser>();
  const { email, showSnackbar } = useContext(AppContext);

  const { courseId } = useParams<any>(); // Two routest for this page. Consider both when reading params
  const [lessons, setLessons] = useState<IVideoLesson[]>([]);
  const [liveLessons, setLiveLessons] = useState<ILiveLesson[]>([]);

  const [accepted, setAccepted] = useState<boolean>(false);
  const [displayAlert, setDisplayAlert] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      // Check the lessons paid by user
      getDocsWithProps<IUser[]>(Entity.USERS, { ownerEmail: email }),
      // All lessons related to courseId
      getDocsWithProps<IVideoLesson[]>(Entity.LESSONS_VIDEO, { courseId, ownerEmail: email }),
      getDocsWithProps<ILiveLesson[]>(Entity.LESSONS_LIVE, { courseId, ownerEmail: email }),
      // Find the lesson order of the course
      getDocWithId<ICourse>(Entity.COURSES, courseId),
    ]).then((result) => {
      const [users, lessons, liveLessons, course] = result;

      if (liveLessons) { setLiveLessons(liveLessons); }

      if (users && lessons && liveLessons && course) {
        const lessons4Course: IVideoLesson[] = [];
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
  }, [email]);

  const freeOrPurchased = (lesson: ILesson2) => (!lesson.price)
    || ((user?.lessons.find((les) => les.id === lesson.id && les.watchedCount < Config.allowedWatchCount)));

  const handlePaymentSuccess = async (amount: number, date: number, lessonId: string) => {
    if (!email) return;

    let editableUser = user;

    if (!editableUser) {
      editableUser = {
        id: email,
        ownerEmail: email,
        lessons: [],
      };
    }
    const lesson = lessons.find((l) => l.id === lessonId);

    if (!lesson) return;

    const paymentRef = await addDoc<Omit<IPayment, 'id'>>(Entity.PAYMENTS, {
      amount, date, ownerEmail: email, paidFor: lesson.ownerEmail, lessonId,
    });

    const alreadyPurchased = editableUser.lessons.findIndex((sub) => sub.id === lesson.id);
    if (alreadyPurchased > -1) {
      editableUser.lessons[alreadyPurchased].watchedCount = 0;
      editableUser.lessons[alreadyPurchased].paymentRef = paymentRef;
    } else {
      editableUser.lessons.push({
        id: lessonId,
        paymentRef,
        watchedCount: 0,
      });
    }
    // This fails(permission), non product owners tries to edit value
    // updateDoc(Entity.LESSONS, lessonId, { subCount: firebase.firestore.FieldValue.increment(1) });

    if (user) {
      updateDoc(Entity.USERS, editableUser.id, editableUser).then(() => {
        setUser(editableUser);
        showSnackbar('Payment success');
      });
    } else { // this check is to fix ts issue below
      addDocWithId(Entity.USERS, editableUser.ownerEmail, editableUser).then(() => {
        setUser(editableUser);
        showSnackbar('Payment success');
      });
    }
  };

  const handleSelectLesson = (lesson: ILesson2) => {
    if (freeOrPurchased(lesson)) {
      if (lesson.price > 0) {
        setDisplayAlert(true);
      }
    } else {
      const dd = new Date().getTime();
      paymentJS.onDismissed = function onDismissed() {
        // Note: Prompt user to pay again or show an error page
        // TODO: Remove this code

        if (Config.isProd) {
          console.log('Payment cancelled');
          showSnackbar('Payment cancelled');
        } else {
          console.log('Succeed');
          showSnackbar('Dev Payment Succeed');
          handlePaymentSuccess(lesson.price, dd, lesson.id);
        }
        // handlePaymentSuccess(lesson.price, dd, lesson.id);
      };
      paymentJS.onCompleted = function onDismissed() {
        // Note: Prompt user to pay again or show an error page
        // TODO: Remove this code
        if (Config.isProd) {
          console.log('Succeed');
          showSnackbar('Sorry, Payment gateway is under maintanance. Please contact us for inquiries');
        } else {
          console.log('Succeed');
          showSnackbar('Dev Payment Succeed');
          handlePaymentSuccess(lesson.price, dd, lesson.id);
        }
      };

      // Show payment dialog
      startPay(email, lesson.id, lesson.price, dd);
    }
  };

  const getRemain = (lesson: ILesson2) => user?.lessons.find((l) => l.id === lesson.id)?.watchedCount ?? 0;

  return (
    <div className="container">
      {
        liveLessons.map((live) => {
          let status: 'yes' | 'no' | 'none' | undefined;
          if (live.price) {
            // if (freeOrPurchased(live)) {
            //   status = 'yes';
            // } else {
            status = 'no';
            // }
          } else {
            status = 'none';
          }
          return (
            <div
              // onClick={() => handleSelectLesson(live)}
              key={live.id}
              role="button"
              tabIndex={0}
              // onKeyDown={() => handleSelectLesson(lesson)}
            >
              <Category
                id={live.id}
                CategoryImg={DesktopWindowsIcon}
                title1={`${live.topic}`}
                title2={`${live.description}`}
                title3={`${new Date(live.dateTime).toString().split('GMT')[0]}`}
                // title3={live.price > 0 ? `Watched: ${getRemain(live)}/${lesson.watchCount}` : 'Free'}
                title5="Live"
                title6={`${live.duration} mins`}
                navURL=""
                // navURL={freeOrPurchased(live)
                //    && (accepted || live.price === 0) ? `${courseId}/${live.id}` : `${courseId}`}
                status={status}
              />
            </div>
          );
        })
      }
      {
        lessons?.map((lesson, idx) => {
          let status: 'yes' | 'no' | 'none' | undefined;
          if (lesson.price) {
            if (freeOrPurchased(lesson)) {
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
                title3={lesson.price > 0
                  ? `Watched: ${getRemain(lesson)}/${Config.allowedWatchCount}` : 'Free'}
                title4={`${lesson.duration} mins`}
                navURL={freeOrPurchased(lesson)
                   && (accepted || lesson.price === 0) ? `${courseId}/${lesson.id}` : `${courseId}`}
                status={status}
              />
            </div>
          );
        })
      }

      {displayAlert && !accepted && (
      <AlertDialog
        onAccept={() => {
          setAccepted(true);
        }}

        onCancel={() => {
          setAccepted(false);
          setDisplayAlert(false);
        }}
      />
      )}
    </div>
  );
};
