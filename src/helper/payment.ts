import { Util } from './util';
// @ts-ignore
// eslint-disable-next-line no-undef
export const paymentJS = payhere;

const getPaymentObj = (email: string, lessonId: string, amount: number, dd:number) => ({
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
  custom_1: `${dd}`,
  // custom_2: '',
});

// paymentJS.onDismissed = function onDismissed() {
//   // Note: Prompt user to pay again or show an error page
//   // TODO: Remove this code
//   console.log('Payment dismissed completed.');
//   const dd = new Date().getTime();
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

export const startPay = (email: string|null, lessonId: string, amount: number, dd: number) => {
  if (!email) {
    if (Util.invokeLogin) {
      Util.invokeLogin();
    }
  } else {
    paymentJS.startPayment(getPaymentObj(email, lessonId, amount, dd));
  }
};
