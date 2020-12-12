import React, { useEffect, useState } from 'react';
import { Entity, getDocsWithProps } from '../../../data/Store';
import { IPayment } from '../../../interfaces/IPayment';
import { NOT_VALIDATED } from '../../presentational/paymentOptions/requestPayment/RequestPaymentValidation';

export const PaymentRequests = () => {
  const [pending, setPending] = useState<IPayment[]>([]);

  useEffect(() => {
    getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, { status: NOT_VALIDATED }).then((data) => data && setPending(data));
  }, []);

  return (
    <div>
      Payment Requests:
      {pending.map((payent) => <div>{payent.ownerEmail}</div>)}
    </div>
  );
};
