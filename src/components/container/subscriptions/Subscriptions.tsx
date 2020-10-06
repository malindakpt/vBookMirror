import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import { getDocsWithProps } from '../../../data/Store';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { ILesson } from '../../../interfaces/ILesson';
import { IUser } from '../../../interfaces/IUser';

export const Subscriptions = () => {
  useBreadcrumb();
  const { email } = useContext(AppContext);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [subCount, setSubCount] = useState<number[]>([]);

  const setSubs = (idx:number, lessonId: string) => {
    getDocsWithProps<IUser[]>('users', { lessons: [lessonId] }).then((data) => {
      setSubCount((prev) => {
        const clone = [...prev];
        clone[idx] = data.length;
        return clone;
      });
    });
  };

  useEffect(() => {
    getDocsWithProps<ILesson[]>('lessons', { email, 'price>': 0 }).then((data) => {
      setLessons(data);
      setSubCount(new Array(data.length));

      data.forEach((les, idx) => {
        setSubs(idx, les.id);
      });
    });
  }, [email]);

  let totalSub = 0;
  let totalAmount = 0;
  return (
    <>
      <h2>Subscriptions</h2>
      <table className="center w100">

        <tbody>
          { lessons.map((l, idx) => {
            const count = subCount[idx] ?? 0;
            totalSub += count ?? 0;
            totalAmount += count * l.price;
            return (
              <tr key={l.id}>
                <td>{l.topic}</td>
                <td>{l.description}</td>
                <td>{l.price}</td>
                <td>{subCount[idx]}</td>
                <td className="right">{subCount[idx] && subCount[idx] * l.price}</td>
              </tr>
            );
          }) }
          <tr>
            <td />
            <td />
            <td className="right"><b>Total :</b></td>
            <td><b>{totalSub}</b></td>
            <td className="right"><b>{ totalAmount && totalAmount }</b></td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
