import { Button } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import {
  addDoc, Entity, getDocsWithProps,
} from '../../../data/Store';
import { teacherPortion } from '../../../helper/util';
import { IPayment } from '../../../interfaces/IPayment';
import { ITeacher } from '../../../interfaces/ITeacher';

export const Payments = () => {
  const [busy, setBusy] = useState<boolean>(false);
  const { email, showSnackbar } = useContext(AppContext);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);

  const [allPayments, setAllPayments] = useState<{[id: string]: number}>({});
  const [paidPayments, setPaidPayments] = useState<{[id: string]: number}>({});

  useEffect(() => {
    getDocsWithProps<ITeacher[]>(Entity.TEACHERS, {}).then((data) => setTeachers(data));
  }, []);

  const checkBal = (teacher: ITeacher) => {
    getDocsWithProps<IPayment[]>(Entity.PAYMENTS, { paidFor: teacher.ownerEmail }).then((data) => {
      const total = data.length > 0 ? data.reduce((a, b) => ({ ...a, amount: a.amount + b.amount })).amount : 0;
      setAllPayments((prev) => {
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
      setPaidPayments((prev) => {
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
    <>
      <table className="center w100">
        <tbody>
          { teachers.map((t) => {
            const payble = (allPayments[t.id] ?? 0) - (paidPayments[t.id] ?? 0);
            return (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.ownerEmail}</td>
                <td><Button onClick={() => checkBal(t)}>Check Balance</Button></td>
                <td>{allPayments[t.id]}</td>
                <td>{paidPayments[t.id]}</td>
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
    </>
  );
};
