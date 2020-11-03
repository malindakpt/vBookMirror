import React, { useContext, useEffect, useState } from 'react';
import classes from './Subscriptions.module.scss';
import { AppContext } from '../../../App';
import { Entity, getDocsWithProps, getDocWithId } from '../../../data/Store';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { ILesson } from '../../../interfaces/ILesson';
import { ITeacher } from '../../../interfaces/ITeacher';
import { IPayment } from '../../../interfaces/IPayment';

interface LessMap {payments: IPayment[], lesson: ILesson}

export const Subscriptions = () => {
  useBreadcrumb();
  const { email } = useContext(AppContext);

  const [videoLessons, setVideoLessons] = useState<LessMap[]>([]);
  const [liveLessons, setLiveLessons] = useState<LessMap[]>([]);

  const [teacher, setTeacher] = useState<ITeacher>();

  useEffect(() => {
    if (email) {
      getDocWithId<ITeacher>(Entity.TEACHERS, email).then((data) => data && setTeacher(data));

      // TODO: add live lessons here
      Promise.all([
        getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, { paidFor: email }),
        getDocsWithProps<ILesson[]>(Entity.LESSONS_VIDEO, { ownerEmail: email }),
        getDocsWithProps<ILesson[]>(Entity.LESSONS_LIVE, { ownerEmail: email }),
      ]).then(([payments, lessonsV, lessonsL]) => {
        const vlessonArr: LessMap[] = [];
        const llessonArr: LessMap[] = [];

        for (const vLes of lessonsV) {
          if (vLes.price > 0) {
            const payList = payments.filter((p) => p.lessonId === vLes.id);
            vlessonArr.push({
              lesson: vLes,
              payments: payList,
            });
          }
        }

        for (const lLes of lessonsL) {
          if (lLes.price > 0) {
            const payList = payments.filter((p) => p.lessonId === lLes.id);
            llessonArr.push({
              lesson: lLes,
              payments: payList,
            });
          }
        }

        setVideoLessons(vlessonArr);
        setLiveLessons(llessonArr);
      });
    }
  }, [email]);

  let vTotal = 0;
  let lTotal = 0;

  const getLessonsTable = (lessons: LessMap[], isLive: boolean) => (
    <>
      <h2>{isLive ? 'Live lessons income' : 'Video lessons income'}</h2>
      <table className="center w100">
        <tbody>
          <tr key={0}>
            <th>Lesson</th>
            <th>Price</th>
            <th>Subscriptions</th>
            <th>Total</th>
          </tr>
          {
      lessons.map((val) => {
        const tot = val.payments.reduce(
          (a, b) => ({ ...a, amount: a.amount + b.amount }), { amount: 0 },
        ).amount;

        if (isLive) {
          lTotal += tot;
        } else {
          vTotal += tot;
        }

        return (
          <tr key={val.lesson.id}>
            <td>{val.lesson.topic}</td>
            <td>{val.lesson.price}</td>
            <td>{val.payments.length}</td>
            <td>
              {tot}
            </td>
          </tr>
        );
      })
      }
          <tr key={1}>
            <th>.</th>
            <th>.</th>
            <th>Total</th>
            <th>{isLive ? lTotal : vTotal}</th>
          </tr>
        </tbody>
      </table>
    </>
  );

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
            getLessonsTable(videoLessons, false)
          }
          {
            getLessonsTable(liveLessons, true)
          }
        </div>
      )
        : <div />}
    </>
  );
};
