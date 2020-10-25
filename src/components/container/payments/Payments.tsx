import { Button } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import {
  addDoc, Entity, getDocsWithProps,
} from '../../../data/Store';
import { teacherPortion } from '../../../helper/util';
import { ILesson } from '../../../interfaces/ILesson';
import { IPayment } from '../../../interfaces/IPayment';
import { ITeacher } from '../../../interfaces/ITeacher';
import classes from './Payments.module.scss';

export const Payments = () => {
  const [busy, setBusy] = useState<boolean>(false);
  const { email, showSnackbar } = useContext(AppContext);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);

  const [studentPayments, setStudentPayments] = useState<{[id: string]: number}>({});
  const [teacherPayments, setTeacherPayments] = useState<{[id: string]: number}>({});

  const [teacherLessons, setTeacherLsssons] = useState<{[id: string]: ILesson}>({});
  const [payments, setPayments] = useState<IPayment[]>([]);

  useEffect(() => {
    getDocsWithProps<ITeacher[]>(Entity.TEACHERS, {}).then((data) => setTeachers(data));
  }, []);

  const checkBal = (teacher: ITeacher) => {
    getDocsWithProps<ILesson[]>(Entity.LESSONS, { ownerEmail: teacher.ownerEmail }).then((data) => {
      const lessonMap: any = {};
      data.forEach((less) => {
        lessonMap[less.id] = less;
      });
      setTeacherLsssons(lessonMap);
    });

    getDocsWithProps<IPayment[]>(Entity.PAYMENTS, { paidFor: teacher.ownerEmail }).then((data) => {
      setPayments(data);
      const total = data.length > 0
        ? data.reduce((a, b) => ({ ...a, amount: a.amount + b.amount })).amount : 0;
      setStudentPayments((prev) => {
        const clone = { ...prev };
        clone[teacher.ownerEmail] = teacherPortion(teacher.commission, total);
        return clone;
      });
    });

    getDocsWithProps<IPayment[]>(Entity.PAYMENTS_TEACHER, { paidFor: teacher.ownerEmail }).then((data) => {
      const total = data.length > 0 ? data.reduce((a, b) => ({
        ...a,
        amount: a.amount + b.amount,
      })).amount : 0;
      setTeacherPayments((prev) => {
        const clone = { ...prev };
        clone[teacher.ownerEmail] = total;
        return clone;
      });
    });
  };

  const pay = (teacherEmail: string) => {
    setBusy(true);
    // @ts-ignore
    const amount = Number(document.getElementById(teacherEmail)?.value);
    const date = new Date().getTime();

    if (email) {
      addDoc<Omit<IPayment, 'id'>>(Entity.PAYMENTS_TEACHER, {
        ownerEmail: email, paidFor: teacherEmail, date, amount, lessonId: '',
      }).then(() => {
        showSnackbar(`Payment done:${amount}`);
        setBusy(false);
      });
    } else {
      showSnackbar('email not exists');
    }
  };

  return (
    <div className={classes.container}>
      <table>
        <tbody>
          { teachers.map((t) => {
            const payble = (studentPayments[t.id] ?? 0) - (teacherPayments[t.id] ?? 0);
            return (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.ownerEmail}</td>
                <td><Button onClick={() => checkBal(t)}>Check Balance</Button></td>
                <td>{studentPayments[t.id]}</td>
                <td>{teacherPayments[t.id]}</td>
                <td>{payble}</td>
                <td>
                  <input
                    type="number"
                    id={t.id}
                  />
                  <Button
                    onClick={() => pay(t.ownerEmail)}
                    disabled={busy}
                  >
                    Pay
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <table>
        <tbody>
          { payments.sort((a, b) => b.date - a.date).map((p) => (
            <tr key={p.id}>
              <td>{new Date(p.date).toDateString()}</td>
              <td>{p.ownerEmail}</td>
              <td>{teacherLessons[p.lessonId]?.topic}</td>
              <td>{p.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
