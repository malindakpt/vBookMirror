import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import { getDocsWithProps } from '../../../data/Store';
import { ILesson } from '../../../interfaces/ILesson';
import { IUser } from '../../../interfaces/IUser';

export const Subscriptions = () => {
  const { email } = useContext(AppContext);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [subCount, setSubCount] = useState<number[]>([]);

  const setSubs = (idx:number, lessonId: string) => {
    getDocsWithProps<IUser[]>('users', { lessons: [lessonId] }, {}).then((data) => {
      setSubCount((prev) => {
        const clone = [...prev];
        clone[idx] = data.length;
        return clone;
      });
    });
  };

  useEffect(() => {
    getDocsWithProps<ILesson[]>('lessons', { email, 'price>': 0 }, {}).then((data) => {
      setLessons(data);
      setSubCount(new Array(data.length));

      data.forEach((les, idx) => {
        setSubs(idx, les.id);
      });
    });
  }, [email]);

  return (
    <>
      <h2>Subscriptions</h2>
      <table className="center w100">

        <tbody>
          { lessons.map((l, idx) => (
            <tr key={l.id}>
              <td>{l.topic}</td>
              <td>{l.description}</td>
              <td>{l.price}</td>
              <td>{subCount[idx]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
