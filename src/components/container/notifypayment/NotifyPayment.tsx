import React from 'react';
import { useParams } from 'react-router-dom';

export const NotifyPayment = () => {
  const { type } = useParams<any>();
  return (
    <div>
      Notification for payment:
      {type}
    </div>
  );
};
