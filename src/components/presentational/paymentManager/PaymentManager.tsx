import React, { useContext } from 'react';
import { AppContext } from '../../../App';
import { ILesson } from '../../../interfaces/ILesson';
import { AddPayment } from './AddPayment';

interface Props {
  lesson?: ILesson;
}
export const PaymentManger: React.FC<Props> = ({ lesson }) => {
  const { email } = useContext(AppContext);
  return lesson?.ownerEmail === email ? <AddPayment lesson={lesson} /> : <></>;
};
