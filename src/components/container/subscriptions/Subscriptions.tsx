import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import { getDocsWithProps, getDocWithId } from '../../../data/Store';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { ILesson } from '../../../interfaces/ILesson';
import { ITeacher } from '../../../interfaces/ITeacher';

export const Subscriptions = () => {
  useBreadcrumb();
  const { email } = useContext(AppContext);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [teacher, setTeacher] = useState<ITeacher>();

  useEffect(() => {
    if (email) {
      getDocWithId<ITeacher>('teachers', email).then((data) => data && setTeacher(data));
      getDocsWithProps<ILesson[]>('lessons', { ownerEmail: email, 'price>': 0 }).then((data) => {
        setLessons(data);
      });
    }
  }, [email]);

  // const totalSub = 0;
  let totalAmount = 0;
  return (
    <>
      {teacher && (
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
      )}

      <h2>Subscriptions</h2>
      <table className="center w100">

        <tbody>
          {
            teacher && lessons?.map((l, idx) => {
              const balPayment = l.price * ((100 - teacher.commission) / 100) * (l.subCount ?? 0);
              totalAmount += balPayment;
              return (
                <tr key={l.id}>
                  <td>{l.topic}</td>
                  <td>{l.description}</td>
                  <td>{l.price}</td>
                  <td>{balPayment}</td>
                  <td>{l.subCount ?? 0}</td>
                  <td>{l.subCount ? l.subCount * balPayment : 0}</td>
                  <td className="right">{balPayment}</td>
                </tr>
              );
            })
          }
          <tr>
            <td />
            <td />
            <td className="right"><b>Total :</b></td>
            <td><b /></td>
            <td className="right"><b>{ totalAmount }</b></td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
