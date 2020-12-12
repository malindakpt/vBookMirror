import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Config from '../../../data/Config';
import {
  Entity, getDocsWithProps, sendHttp,
} from '../../../data/Store';
import { useForcedUpdate } from '../../../hooks/useForcedUpdate';
import { IPayment } from '../../../interfaces/IPayment';
import { NOT_VALIDATED } from '../../presentational/paymentOptions/requestPayment/RequestPaymentValidation';

export const PaymentRequests = () => {
  const [pending, setPending] = useState<IPayment[]>([]);
  const [onUpdate, forceUpdate] = useForcedUpdate();

  useEffect(() => {
    getDocsWithProps<IPayment[]>(
      Entity.PAYMENTS_STUDENTS,
      { status: NOT_VALIDATED, disabled: true },
    ).then((data) => data && setPending(data));
  }, [onUpdate]);

  const approvePayment = (paymentId: string) => {
    sendHttp(Config.validatePaymentUrl, { id: paymentId, disabled: false }).then(() => {
      forceUpdate();
    });
  };

  return (
    <div>
      <table>
        <tbody>

          {pending.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.ownerEmail}</td>
              <td>{payment.paymentRef}</td>
              <td>{`${payment.paymentObject}`}</td>
              <td><Button onClick={() => approvePayment(payment.id)}>Approve </Button></td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
};
