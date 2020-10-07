import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@material-ui/core';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import { Category } from '../../presentational/category/Category';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import {
  getDocsWithProps, addDoc, updateDoc, getDocWithId,
} from '../../../data/Store';
import { AppContext } from '../../../App';
import { ILesson } from '../../../interfaces/ILesson';
import { IUser } from '../../../interfaces/IUser';
import { ICourse } from '../../../interfaces/ICourse';
import { Util } from '../../../helper/util';
import classes from './Course.module.scss';

export const Course: React.FC = () => {
  useBreadcrumb();

  const [selectedLessons, setSelectedLessons] = useState<{[key: string]: boolean}>({});
  const [user, setUser] = useState<IUser>();
  const [total, setTotal] = useState(0);
  const { email, showSnackbar } = useContext(AppContext);

  const { courseId } = useParams<any>(); // Two routest for this page. Consider both when reading params
  const [lessons, setLessons] = useState<ILesson[]>([]);

  useEffect(() => {
    Promise.all([
      getDocsWithProps<IUser[]>('users', { email }),
      getDocsWithProps<ILesson[]>('lessons', {}),
      getDocWithId<ICourse>('courses', courseId),
    ]).then((result) => {
      const [users, lessons, course] = result;

      if (users && lessons && course) {
        let lessons4Course: ILesson[] = [];
        course?.lessons.forEach((lesId) => {
          const les = lessons.find((l) => l.id === lesId);
          if (les) {
            lessons4Course = [les, ...lessons4Course];
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

  const handleSelectLesson = (id: string, selected: boolean) => {
    if (!email) {
      if (Util.invokeLogin) {
        Util.invokeLogin();
      }
    } else {
      let total = 0;
      const next: any = { ...selectedLessons };
      next[id] = selected;

      for (const les of lessons) {
        if (next[les.id] && les.price) {
          total += les.price;
        }
      }

      setSelectedLessons(next);
      setTotal(total);
    }
  };

  const pay = async () => {
    if (!email) return;

    // const usersWithEmail: IUser[] = await getDocsWithProps('users', { email }, {});
    if (user) {
      for (const [les, subscribed] of Object.entries(selectedLessons)) {
        if (subscribed) {
          user.lessons.push(les);
        }
      }
      updateDoc('users', user.id, user).then(() => {
        showSnackbar('Subscribed to lessons');
        setSelectedLessons({});
        setTotal(0);
      });
    } else {
      const newUser: IUser = {
        id: '',
        email,
        lessons: [],
      };
      for (const [les, subscribed] of Object.entries(selectedLessons)) {
        if (subscribed) {
          newUser.lessons.push(les);
        }
      }
      addDoc('users', newUser).then(() => {
        showSnackbar('Subscribed to lessons');
        setSelectedLessons({});
        setTotal(0);
      });
    }
  };

  return (
    <div className="container">
      {total > 0 && (
      <div className={classes.purchase}>
        <div className={classes.box}>
          <span>
            { `Rs. ${total}.00`}
          </span>
          <Button
            variant="contained"
            onClick={pay}
            color="secondary"
          >
            Purchase
          </Button>
        </div>
      </div>
      )}
      {
        lessons?.map((lesson, idx) => {
          let status: 'yes'|'no'| 'none' | undefined;
          if (lesson.price) {
            if (user?.lessons.includes(lesson.id)) {
              status = 'yes';
            } else {
              status = 'no';
            }
          } else {
            status = 'none';
          }

          return (
            <Category
              id={lesson.id}
              key={idx}
              CategoryImg={OndemandVideoIcon}
              title1={`${lesson.topic}`}
              title2={`${lesson.description}`}
              navURL={!lesson.price
                || user?.lessons.includes(lesson.id) ? `${courseId}/${lesson.id}` : `${courseId}`}
              onSelect={handleSelectLesson}
              status={status}
            />
          );
        })
      }
    </div>
  );
};