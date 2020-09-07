import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Category } from '../../presentational/category/Category';
import classes from './Contents.module.scss';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps, addDoc, updateDoc } from '../../../data/Store';
import { ILesson, IUser } from '../../../data/Interfaces';
import { AppContext } from '../../../App';

export const Course: React.FC = () => {
  useBreadcrumb();

  const [selectedLessons, setSelectedLessons] = useState<{[key: string]: boolean}>({});
  const [subscriptions, setSubcriptions] = useState<{[key: string]: boolean}>({});
  const [total, setTotal] = useState(0);
  const { email, showSnackbar } = useContext(AppContext);

  const { courseId } = useParams();
  const [lessons, setLessons] = useState<ILesson[]>([]);

  useEffect(() => {
    getDocsWithProps('lessons', { courseId }, {}).then((data: ILesson[]) => {
      setLessons(data);
    });
    getDocsWithProps('users', { email }, {}).then((data: IUser[]) => {
      if (data[0]) { setSubcriptions(data[0].lessons); }
    });
    // eslint-disable-next-line
  }, []);

  const handleSelectLesson = (id: string, selected: boolean) => {
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
  };

  const pay = async () => {
    if (!email) return;

    const usersWithEmail: IUser[] = await getDocsWithProps('users', { email }, {});
    if (usersWithEmail.length > 0) {
      const { lessons } = usersWithEmail[0];

      for (const [les, subscribed] of Object.entries(selectedLessons)) {
        if (subscribed) {
          lessons[les] = true;
        }
      }
      updateDoc('users', email, { lessons }).then(() => {
        showSnackbar('Subscribed to lessons');
        console.log(selectedLessons);
      });
    } else {
      const newUser: IUser = {
        email, lessons: {},
      };
      for (const [les, subscribed] of Object.entries(selectedLessons)) {
        if (subscribed) {
          newUser.lessons[les] = true;
        }
      }
      addDoc('users', newUser).then(() => {
        showSnackbar('Subscribed to lessons');
        console.log(selectedLessons);
      });
    }
  };

  return (
    <div className={classes.root}>
      {total > 0 && (
      <div className={classes.center}>
        <div />
        <div className={classes.price}>
          <span className={classes.cost}>
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
        lessons?.map((lesson, idx) => (
          <Category
            id={lesson.id}
            key={idx}
            title1={`Week ${idx}`}
            title2={lesson.description}
            title3={lesson.price ? `Rs: ${lesson.price}` : ''}
            navURL={subscriptions[lesson.id] ? `${courseId}/${lesson.id}` : `${courseId}`}
            onSelect={handleSelectLesson}
          />
        ))
      }
    </div>
  );
};
