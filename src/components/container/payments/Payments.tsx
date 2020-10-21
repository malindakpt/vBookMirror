import React, { useEffect, useState } from 'react';
import { getDocsWithProps } from '../../../data/Store';
import { ITeacher } from '../../../interfaces/ITeacher';

export const Payments = () => {
  const [teachers, setTeachers] = useState<ITeacher[]>([]);

  useEffect(() => {
    getDocsWithProps<ITeacher[]>('teachers', {}).then((data) => setTeachers(data));
  }, []);

  return (
    <>
      <table className="center w100">

        <tbody>
          { teachers.map((t) => (
            <tr>
              <td>{t.name}</td>
              <td>{t.ownerEmail}</td>
              <td />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
