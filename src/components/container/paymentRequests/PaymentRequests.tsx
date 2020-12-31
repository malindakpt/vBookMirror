import { Button } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import Config from '../../../data/Config';
import {
  Entity, getDocsWithProps, sendHttp,
} from '../../../data/Store';
import { useForcedUpdate } from '../../../hooks/useForcedUpdate';
import { IPayment, PaymentGateway } from '../../../interfaces/IPayment';
import { PaymentStatus } from '../../presentational/paymentOptions/requestPayment/RequestPaymentValidation';

export const PaymentRequests = () => {
  const { email } = useContext(AppContext);
  const [pending, setPending] = useState<IPayment[]>([]);
  const [onUpdate, forceUpdate] = useForcedUpdate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDocsWithProps<IPayment[]>(
      Entity.PAYMENTS_STUDENTS,
      {
        status: PaymentStatus.NOT_VALIDATED, gateway: PaymentGateway.MANUAL, disabled: true, paidFor: email,
      },
    ).then((data) => data && setPending(data));
  }, [onUpdate, email]);

  const approvePayment = (paymentId: string, disabled: boolean) => {
    setBusy(true);
    sendHttp(Config.validatePaymentUrl,
      { id: paymentId, disabled, status: PaymentStatus.VALIDATED }).then(() => {
      forceUpdate();
      setBusy(false);
    });
  };

  return (
    <div style={{ overflow: 'auto' }}>
      <table className="w100">
        <tbody>
          {pending.map((payment) => (
            <tr key={payment.id}>
              <td>
                <Button
                  disabled={busy}
                  variant="contained"
                  color="primary"
                  onClick={() => approvePayment(payment.id, false)}
                >
                  Approve
                </Button>
              </td>
              <td>
                <Button
                  disabled={busy}
                  variant="contained"
                  color="secondary"
                  onClick={() => approvePayment(payment.id, true)}
                >
                  Reject
                </Button>
              </td>
              <td>{payment.ownerEmail}</td>
              <td>{payment.paymentRef}</td>
              <td>{`${payment.paymentObject}`}</td>
              <td>{payment.amount}</td>
              <td>{new Date(payment.createdAt ?? 0).toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
