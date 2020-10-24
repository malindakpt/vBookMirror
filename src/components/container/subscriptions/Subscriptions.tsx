import React, { useContext, useEffect, useState } from 'react';
import classes from './Subscriptions.module.scss';
import { AppContext } from '../../../App';
import { Entity, getDocsWithProps, getDocWithId } from '../../../data/Store';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { ILesson } from '../../../interfaces/ILesson';
import { ITeacher } from '../../../interfaces/ITeacher';
import { IPayment } from '../../../interfaces/IPayment';

interface LessMap {[key: string]: {payments: IPayment[], lesson: ILesson}}

export const Subscriptions = () => {
  useBreadcrumb();
  const { email } = useContext(AppContext);
  const [lessMap, setLessMap] = useState<LessMap>({});
  const [teacher, setTeacher] = useState<ITeacher>();

  const [total, setTotal] = useState<number>(0);

  const teacherPortion = (amount: number) => Math.round((amount
     * ((100 - (teacher?.commission ?? 0)) / 100)));

  useEffect(() => {
    if (email) {
      getDocWithId<ITeacher>(Entity.TEACHERS, email).then((data) => data && setTeacher(data));

      Promise.all([
        getDocsWithProps<IPayment[]>(Entity.PAYMENTS, { paidFor: email }),
        getDocsWithProps<ILesson[]>(Entity.LESSONS, { ownerEmail: email }),
      ]).then(([payments, lessons]) => {
        const lessonMap: LessMap = {};
        let total = 0;
        for (const payment of payments) {
          if (!lessonMap[payment.lessonId]) {
            const lesson = lessons.find((l) => l.id === payment.lessonId);
            if (lesson) {
              lessonMap[payment.lessonId] = {
                lesson,
                payments: [],
              };
            } else {
              console.log('Lesson, not found:', payment.lessonId);
            }
          }
          total += payment.amount;
          lessonMap[payment.lessonId]?.payments.push(payment);
        }
        setLessMap(lessonMap);
        setTotal(total);
      });
    }
  }, [email]);

  return (
    <>
      {teacher ? (
        <div className={classes.container}>
          <div>
            <span style={{ marginRight: '5px' }}>Profile url:</span>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={`teacher/${teacher.shortId}`}
            >
              akshara.lk/teacher/
              {teacher.shortId}
            </a>
          </div>

          <h2>Subscriptions</h2>
          <table className="center w100">

            <tbody>

              <tr key={0}>
                <th>Lesson</th>
                <th>Teacher Portion</th>
                <th>Count</th>
                <th>Total</th>
              </tr>
              {
          Object.values(lessMap)?.map((val) => (
            <tr key={val.lesson.id}>
              <td>{val.lesson.topic}</td>
              <td>{teacherPortion(val.lesson.price)}</td>
              <td>{val.payments.length}</td>
              <td>{teacherPortion(val.payments.reduce((a, b) => ({ ...a, amount: a.amount + b.amount })).amount)}</td>
            </tr>
          ))
          }
              <tr key={1}>
                <th>.</th>
                <th>.</th>
                <th>Total</th>
                <th>{total}</th>
              </tr>
            </tbody>
          </table>
        </div>
      )
        : <div />}
    </>
  );
};
