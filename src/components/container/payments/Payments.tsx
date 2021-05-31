import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
  Entity, getDocsWithProps, updateDoc,
} from '../../../data/Store';
import { IPayment } from '../../../interfaces/IPayment';
import classes from './Payments.module.scss';

export const Payments = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);

  useEffect(() => {
    getDocsWithProps<IPayment>(Entity.PAYMENTS_STUDENTS, {}).then((data) => setPayments(data));
  }, []);

  const resetWatchCount = (paymentId: string) => {
    updateDoc(Entity.PAYMENTS_STUDENTS, paymentId, { disabled: false, watchedCount: 0 });
  };

  return (
    <div className={classes.container}>
      <table>
        <tbody>
          { payments.sort((a, b) => b.date - a.date).map((p) => (
            <tr key={p.id}>
              <td>{new Date(p.date).toDateString()}</td>
              <td>{p.ownerEmail}</td>
              <td>{p.ownerName}</td>
              <td>{p.amount}</td>
              <td>{p.watchedCount ?? 0}</td>
              <td><Button onClick={() => resetWatchCount(p.id)}>Reset</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
