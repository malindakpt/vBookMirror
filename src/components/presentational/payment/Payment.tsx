import { Button } from '@material-ui/core';
import React, { useContext } from 'react';
import { AppContext } from '../../../App';
import { Util } from '../../../helper/util';

// @ts-ignore
// eslint-disable-next-line no-undef
export const paymentJS = payhere;

interface PaymentProps {
    amount: number;
    email: string | null;
    onSuccess: (amount: number, date: number) => void;
}
export const Payment: React.FC<PaymentProps> = ({ amount, email, onSuccess }) => {
  const { showSnackbar } = useContext(AppContext);

  const payment = {
    sandbox: true,
    merchant_id: '1215643', // Replace your Merchant ID
    return_url: undefined, // Important
    cancel_url: undefined, // Important
    notify_url: 'http://sample.com/notify',
    order_id: 'ItemNo12345',
    items: 'අක්ෂර.lk',
    amount: `${amount}`,
    currency: 'LKR',
    first_name: email,
    last_name: '',
    email,
    phone: '0771234567',
    address: 'No.1, Galle Road',
    city: 'Colombo',
    country: 'Sri Lanka',
    // delivery_address: 'No. 46, Galle road, Kalutara South',
    // delivery_city: 'Kalutara',
    // delivery_country: 'Sri Lanka',
    // custom_1: '',
    // custom_2: '',
  };

  paymentJS.onDismissed = function onDismissed() {
    // Note: Prompt user to pay again or show an error page
    console.log('Payment dismissed');
    showSnackbar('Payment cancelled');

    // TODO: Remove this code
    console.log('Payment completed.');
    const dd = new Date().getTime();
    onSuccess(amount, dd);
  };

  paymentJS.onError = function onError(error: any) {
    // Note: show an error page
    console.log(`Error: ${error}`);
    showSnackbar(`Error: ${error}`);
  };

  paymentJS.onCompleted = function onCompleted(orderId: string) {
    console.log(`Payment completed. OrderID:${orderId}`);
    const dd = new Date().getTime();
    onSuccess(amount, dd);
    // TODO Note: validate the payment and show success or failure page to the customer
  };

  const startPay = () => {
    if (!email) {
      if (Util.invokeLogin) {
        Util.invokeLogin();
      }
    } else {
      paymentJS.startPayment(payment);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={startPay}
      color="secondary"
    >
      Purchase
    </Button>
  );
};
