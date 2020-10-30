import Config from '../data/Config';
import { Util } from './util';
// @ts-ignore
// eslint-disable-next-line no-undef
export const paymentJS = payhere;

const getPaymentObj = (email: string, lessonId: string, amount: number, dd:number) => ({
  sandbox: !Config.isProd,
  merchant_id: Config.isProd ? '216030' : '1215643', // Replace your Merchant ID
  return_url: 'https://us-central1-akshara-8630e.cloudfunctions.net/akshara/notify/1',
  cancel_url: 'https://us-central1-akshara-8630e.cloudfunctions.net/akshara/notify/2',
  notify_url: 'https://us-central1-akshara-8630e.cloudfunctions.net/akshara/notify/3',
  order_id: `${lessonId}`,
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
  custom_1: `${email}`,
  custom_2: `${lessonId}`,
});

// paymentJS.onDismissed = function onDismissed() {
//   // Note: Prompt user to pay again or show an error page
//   // TODO: Remove this code
//   console.log('Payment dismissed completed.');
//   const dd = new Date().gecdtTime();
// //   onSuccess(amount, dd);
// };

// paymentJS.onError = function onError(error: any) {
//   // Note: show an error page
//   console.log(`Error: ${error}`);
// //   showSnackbar(`Error: ${error}`);
// };

// paymentJS.onCompleted = function onCompleted(orderId: string) {
//   console.log(`Payment completed. OrderID:${orderId}`);
// //   onSuccess(amount, dd);
//   // TODO Note: validate the payment and show success or failure page to the customer
// };

export const startPay = (email: string|null, lessonId: string,
  amount: number, dd: number) => {
  if (!email) {
    if (Util.invokeLogin) {
      Util.invokeLogin();
    }
  } else {
    paymentJS.startPayment(getPaymentObj(email, lessonId, amount, dd));
  }
};
