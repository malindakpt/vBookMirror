import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import classes from './Subscriptions.module.scss';
import { AppContext } from '../../../App';
import { Entity, getDocsWithProps, getDocWithId } from '../../../data/Store';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { ILesson } from '../../../interfaces/ILesson';
import { ITeacher } from '../../../interfaces/ITeacher';
import { IPayment } from '../../../interfaces/IPayment';
import { teacherPortion } from '../../../helper/util';
import { IStudentUpdate } from '../../../interfaces/IStudentUpdate';

interface LessMap {payments: IPayment[], lesson: ILesson}

export const Subscriptions = () => {
  useBreadcrumb();
  const { email } = useContext(AppContext);

  const [videoLessons, setVideoLessons] = useState<LessMap[]>([]);
  const [liveLessons, setLiveLessons] = useState<LessMap[]>([]);

  const [teacher, setTeacher] = useState<ITeacher>();

  useEffect(() => {
    if (email) {
      // TODO: add live lessons here
      Promise.all([
        getDocWithId<ITeacher>(Entity.TEACHERS, email),
        getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, { paidFor: email }),
        getDocsWithProps<ILesson[]>(Entity.LESSONS_VIDEO, { ownerEmail: email }),
        getDocsWithProps<ILesson[]>(Entity.LESSONS_LIVE, { ownerEmail: email }),
      ]).then(([teacher, payments, lessonsV, lessonsL]) => {
        const vlessonArr: LessMap[] = [];
        const llessonArr: LessMap[] = [];

        if (lessonsV && payments) {
          for (const vLes of lessonsV) {
            // if (vLes.price > 0) {
            const payList = payments.filter((p) => p.lessonId === vLes.id);
            vlessonArr.push({
              lesson: vLes,
              payments: payList,
            });
            // }
          }
        }

        if (lessonsL && payments) {
          for (const lLes of lessonsL) {
            // if (lLes.price > 0) {
            const payList = payments.filter((p) => p.lessonId === lLes.id);
            llessonArr.push({
              lesson: lLes,
              payments: payList,
            });
            // }
          }
        }

        if (teacher) {
          setTeacher(teacher);
          setVideoLessons(vlessonArr);
          setLiveLessons(llessonArr);
        }
      });
    }
  }, [email]);

  const [views, setViews] = useState<{lessonId: string, count: number}>();

  const checkViews = (lesson: ILesson) => {
    getDocsWithProps<IStudentUpdate[]>(Entity.STUDENT_INFO, { reference: lesson.id }).then((data) => {
      if (data) {
        setViews({
          lessonId: lesson.id,
          count: data.length,
        });
      }
    });
  };

  const getLessonsTable = (lessons: LessMap[], isLive: boolean, teacher: ITeacher) => {
    let fullTotal = 0;

    return (
      <>
        <h2>{isLive ? 'Live lessons income' : 'Video lessons income'}</h2>
        <table className="center w100">
          <tbody>
            <tr key={0}>
              <th>Lesson</th>
              <th>Price(Now)</th>
              <th>Payments</th>
              <th>Income</th>
            </tr>
            {

      lessons.map((val) => {
        const tot = val.payments.reduce(
          (a, b) => ({ ...a, amount: a.amount + b.amount }), { amount: 0 },
        ).amount;

        fullTotal += tot;

        return (
          <tr key={val.lesson.id}>
            <td>{val.lesson.topic}</td>
            <td>{val.lesson.price}</td>
            <td>{val.payments.length}</td>
            <td>
              {teacherPortion(isLive ? teacher.commissionLive : teacher.commissionVideo, tot)}
            </td>
            <td>
              {views?.lessonId === val.lesson.id && <span>{views.count}</span>}
              <Button onClick={() => checkViews(val.lesson)}>
                Check Views
              </Button>
            </td>
          </tr>
        );
      })
      }
            <tr key={1}>
              <th>.</th>
              <th>.</th>
              <th>Total</th>
              <th>
                {teacherPortion(isLive ? teacher.commissionLive : teacher.commissionVideo, fullTotal)}
              </th>
            </tr>
          </tbody>
        </table>
      </>
    );
  };

  return (
    <>
      {teacher ? (
        <div className={classes.container}>
          <div>
            <span style={{ marginRight: '5px' }}>Profile url:</span>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={`teacher/${teacher.url}`}
            >
              akshara.lk/teacher/
              {teacher.url}
            </a>
          </div>
          {
            getLessonsTable(videoLessons, false, teacher)
          }
          {
            getLessonsTable(liveLessons, true, teacher)
          }
        </div>
      )
        : <div />}
    </>
  );
};
