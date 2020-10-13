import { Button } from '@material-ui/core';
import React, { useContext } from 'react';
import { AppContext } from '../../../App';

// @ts-ignore
// eslint-disable-next-line no-undef
export const paymentJS = payhere;

interface PaymentProps {
    amount: number;
    email: string;
    onSuccess: () => void;
}
export const Payment: React.FC<PaymentProps> = ({ amount, email, onSuccess }) => {
  const { showSnackbar } = useContext(AppContext);

  const payment = {
    sandbox: true,
    merchant_id: '121XXXX', // Replace your Merchant ID
    return_url: undefined, // Important
    cancel_url: undefined, // Important
    notify_url: 'http://sample.com/notify',
    order_id: 'ItemNo12345',
    items: 'Door bell wireles',
    amount: `${amount}`,
    currency: 'LKR',
    first_name: 'Saman',
    last_name: 'Perera',
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
    showSnackbar('Payment dismissed');
  };

  paymentJS.onError = function onError(error: any) {
    // Note: show an error page
    console.log(`Error: ${error}`);
    showSnackbar(`Error: ${error}`);
  };

  paymentJS.onCompleted = function onCompleted(orderId: string) {
    console.log(`Payment completed. OrderID:${orderId}`);
    onSuccess();
    // Note: validate the payment and show success or failure page to the customer
  };

  return (
    <Button
      variant="contained"
      onClick={() => paymentJS.startPayment(payment)}
      color="secondary"
    >
      Purchase
    </Button>
  );
};
