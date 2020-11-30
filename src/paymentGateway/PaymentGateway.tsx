import { Button } from '@material-ui/core';
import React from 'react';
import classes from './PaymentGateway.module.scss';

interface Props {
  redirectUrl: string;
}
export const PaymentGateway: React.FC<Props> = ({ redirectUrl }) => {
  const handlePaymentSuccess = () => {
    window.location.href = redirectUrl;
  };

  return (
    <div>
      <div className={classes.header}>
        Payment Gateway
      </div>
      <div>
        Genie
      </div>
      <div>
        PayHere
      </div>
      <Button onClick={handlePaymentSuccess}>Done</Button>
    </div>
  );
};
