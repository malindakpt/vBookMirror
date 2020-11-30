import Config from '../data/Config';
import { DEFAULT_FULL_NAME, Util } from '../helper/util';
import { ILesson } from '../interfaces/ILesson';
import { PaymentType } from '../interfaces/IPayment';
// @ts-ignore
// eslint-disable-next-line no-undef
export const paymentJS = payhere;

const getPaymentObj = (email: string, name: string, lesson: ILesson,
  amount: number, paidFor: string, type: PaymentType) => ({
  sandbox: !Config.isProd,
  merchant_id: Config.isProd ? '216030' : '1215643', // Replace your Merchant ID
  return_url: 'https://us-central1-akshara-8630e.cloudfunctions.net/akshara/notify/1',
  cancel_url: 'https://us-central1-akshara-8630e.cloudfunctions.net/akshara/notify/2',
  notify_url: 'https://us-central1-akshara-8630e.cloudfunctions.net/akshara/notify/3',
  order_id: `${lesson.id}##${paidFor}##${lesson.type}`,
  items: `${lesson.topic}: ${lesson.description}`,
  amount: `${amount}`,
  currency: 'LKR',
  first_name: email,
  last_name: '',
  email,
  phone: '0771234567',
  address: `Name: ${name}`,
  city: 'Colombo',
  country: 'Sri Lanka',
  // delivery_address: 'No. 46, Galle road, Kalutara South',
  // delivery_city: 'Kalutara',
  // delivery_country: 'Sri Lanka',
  custom_1: `${email}`,
  custom_2: `${name}`,
});

export const startPay = (email: string|null, name: string, lesson: ILesson,
  amount: number, paidFor: string, type: PaymentType) => {
  if (!email) {
    if (Util.invokeLogin) {
      Util.invokeLogin();
    } else if (!Util.fullName || Util.fullName === DEFAULT_FULL_NAME) {
      alert(`Error with the name related to your email. Please contact ${Config.techPhone}`);
    }
  } else {
    paymentJS.startPayment(getPaymentObj(email, name, lesson, amount, paidFor, type));
  }
};
