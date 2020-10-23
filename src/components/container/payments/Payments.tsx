import { Button } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import { addDoc, Entity, getDocsWithProps } from '../../../data/Store';
import { calcTeacherCommission } from '../../../helper/util';
import { ILesson } from '../../../interfaces/ILesson';
import { IPayment } from '../../../interfaces/IPayment';
import { ITeacher } from '../../../interfaces/ITeacher';

export const Payments = () => {
  const [busy, setBusy] = useState<boolean>(false);
  const { showSnackbar } = useContext(AppContext);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [allPayments, setAllPayments] = useState<{[id: string]: number}>({});
  const [paidPayments, setPaidPayments] = useState<{[id: string]: number}>({});

  useEffect(() => {
    getDocsWithProps<ITeacher[]>(Entity.TEACHERS, {}).then((data) => setTeachers(data));
  }, []);

  const checkBal = (ownerEmail: string, commission: number) => {
    getDocsWithProps<ILesson[]>(Entity.LESSONS, { ownerEmail, 'price>': 0 }).then((lessons) => {
      let totalAmount = 0;
      lessons?.forEach((l) => {
        const balPayment = calcTeacherCommission(l, commission);
        totalAmount += balPayment;
      });

      setAllPayments((prev) => {
        const clone = { ...prev };
        clone[ownerEmail] = totalAmount;
        return clone;
      });
    });

    getDocsWithProps<IPayment[]>(Entity.PAYMENTS_TEACHER, { ownerEmail }).then((payments) => {
      let totalAmount = 0;
      payments?.forEach((p) => {
        totalAmount += p.amount;
      });

      setPaidPayments((prev) => {
        const clone = { ...prev };
        clone[ownerEmail] = totalAmount;
        return clone;
      });
    });
  };

  const pay = (ownerEmail: string) => {
    setBusy(true);
    // @ts-ignore
    const amount = Number(document.getElementById(ownerEmail)?.value);
    const date = new Date().getTime();
    console.log(amount);
    addDoc<Omit<IPayment, 'id'>>(Entity.PAYMENTS_TEACHER, { ownerEmail, date, amount }).then(() => {
      showSnackbar(`Payment done:${amount}`);
      setBusy(false);
    });
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
                <td><Button onClick={() => checkBal(t.ownerEmail, t.commission)}>Check Balance</Button></td>
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
