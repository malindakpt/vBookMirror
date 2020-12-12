import { Button, TextField } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../../../App';
import { addDoc, Entity } from '../../../../data/Store';
import { Util } from '../../../../helper/util';
import { IPayment } from '../../../../interfaces/IPayment';
import { PaymentOptionProps } from '../PaymentOptions';

export const NOT_VALIDATED = 'NOT_VALIDATED';
export const RequestPaymentValidation: React.FC<{options: PaymentOptionProps}> = ({ options }) => {
  const { lesson, email } = options;
  const [paymentRef, setPaymentRef] = useState('');
  const { showSnackbar } = useContext(AppContext);

  const requestValidation = () => {
    alert('req pay');
    if (email) {
      const paymentObj: IPayment = {
        date: new Date().getTime(),
        amount: lesson.price,
        lessonId: lesson.id,
        paymentType: lesson.type,
        paidFor: lesson.ownerEmail, // for calculating teacher salary
        paymentRef,
        paymentObject: lesson.topic,

        ownerEmail: email,
        ownerName: Util.fullName,

        status: NOT_VALIDATED,
        disabled: true, // This is mandetory when multiple payments exists and calculate the watch count
        watchedCount: 0,

        id: '',
        createdAt: 0,
      };

      addDoc(Entity.PAYMENTS_STUDENTS, paymentObj).then(() => {
        showSnackbar('Payment Request Sent');
      });
    }
  };

  return (
    <div style={{ display: 'grid' }}>
      <TextField
        id="ref"
        label="Enter Reference Code"
        value={paymentRef}
        onChange={(e) => setPaymentRef(e.target.value)}
      />

      <Button onClick={requestValidation}>
        Request Validate Payment
      </Button>

    </div>
  );
};