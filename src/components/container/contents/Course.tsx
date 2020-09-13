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
  const [user, setUser] = useState<IUser>();
  const [total, setTotal] = useState(0);
  const { email, showSnackbar } = useContext(AppContext);

  const { courseId } = useParams();
  const [lessons, setLessons] = useState<ILesson[]>([]);

  useEffect(() => {
    getDocsWithProps<ILesson[]>('lessons', { courseId }, {}).then((data) => {
      setLessons(data);
    });
    getDocsWithProps<IUser[]>('users', { email }, {}).then((data) => {
      setUser(data[0]);
    });
    // eslint-disable-next-line
  }, [email, selectedLessons]);

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

    // const usersWithEmail: IUser[] = await getDocsWithProps('users', { email }, {});
    if (user) {
      for (const [les, subscribed] of Object.entries(selectedLessons)) {
        if (subscribed) {
          user.lessons[les] = true;
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
        lessons: {},
      };
      for (const [les, subscribed] of Object.entries(selectedLessons)) {
        if (subscribed) {
          newUser.lessons[les] = true;
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
        lessons?.map((lesson, idx) => {
          let subsText;

          if (lesson.price) {
            if (user?.lessons[lesson.id]) {
              subsText = 'Paid';
            } else {
              subsText = `Rs: ${lesson.price}`;
            }
          } else {
            subsText = 'Free';
          }

          return (
            <Category
              id={lesson.id}
              key={idx}
              title1={`Week ${idx}`}
              title2={lesson.description}
              title3={subsText}
              navURL={!lesson.price || user?.lessons[lesson.id] ? `${courseId}/${lesson.id}` : `${courseId}`}
              onSelect={handleSelectLesson}
            />
          );
        })
      }
    </div>
  );
};
