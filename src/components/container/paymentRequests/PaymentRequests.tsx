import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Config from '../../../data/Config';
import {
  Entity, getDocsWithProps, sendHttp,
} from '../../../data/Store';
import { useForcedUpdate } from '../../../hooks/useForcedUpdate';
import { IPayment, PaymentGateway } from '../../../interfaces/IPayment';
import { PaymentStatus } from '../../presentational/paymentOptions/requestPayment/RequestPaymentValidation';

export const PaymentRequests = () => {
  const [pending, setPending] = useState<IPayment[]>([]);
  const [onUpdate, forceUpdate] = useForcedUpdate();

  useEffect(() => {
    getDocsWithProps<IPayment[]>(
      Entity.PAYMENTS_STUDENTS,
      { status: PaymentStatus.NOT_VALIDATED, gateway: PaymentGateway.MANUAL, disabled: true },
    ).then((data) => data && setPending(data));
  }, [onUpdate]);

  const approvePayment = (paymentId: string) => {
    sendHttp(Config.validatePaymentUrl,
      { id: paymentId, disabled: false, status: PaymentStatus.VALIDATED }).then(() => {
      forceUpdate();
    });
  };

  const rejectPayment = (paymentId: string) => {
    sendHttp(Config.validatePaymentUrl,
      { id: paymentId, disabled: false, status: PaymentStatus.VALIDATED }).then(() => {
      forceUpdate();
    });
  };

  return (
    <div style={{ overflow: 'auto' }}>
      <table className="w100">
        <tbody>
          {pending.map((payment) => (
            <tr key={payment.id}>
              <td>{new Date(payment.createdAt).toDateString()}</td>
              <td>{payment.ownerEmail}</td>
              <td>{payment.paymentRef}</td>
              <td>{`${payment.paymentObject}`}</td>
              <td>{payment.amount}</td>
              <td>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => approvePayment(payment.id)}
                >
                  Approve
                </Button>
              </td>
              <td>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => rejectPayment(payment.id)}
                >
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
