/* eslint-disable max-len */
const APP_CONFIG_DEV = {
  apiKey: 'AIzaSyC5pq-lAQWmVEVmrI0iwQ2bUJvSKp4tXaY',
  authDomain: 'smsm-54fa3.firebaseapp.com',
  databaseURL: 'https://smsm-54fa3.firebaseio.com',
  projectId: 'smsm-54fa3',
  storageBucket: 'smsm-54fa3.appspot.com',
  messagingSenderId: '794082939900',
  appId: '1:794082939900:web:9967e6ea91936c2016d879',
  measurementId: 'G-4SS7PQK8D5',

  watchedTimeout: 500,
  realoadTimeoutAferSuccessPay: 10000,
  allowedWatchCount: 2,
  isProd: false,
  // zoomURL: 'http://127.0.0.1:8887',
  paymentDisabled: false,
  techPhone: '0771141194',
  zoomURL: 'https://smsm-54fa3.web.app',
  studentUpdateUrl: 'http://localhost:4000/studentupdate',
  dialogPaymentUrl: 'http://localhost:4000/dialogCharge',
  dialogConfirmUrl: 'http://localhost:4000/dialogConfirm',
  validatePaymentUrl: 'http://localhost:4000/validatePayment',

  // Variables valid only for dev
  payOnDismiss: false,
};

const APP_CONFIG_PROD = {
  apiKey: 'AIzaSyBx8WR38L8eznu6HtwJghjptEN3Ah6HqzE',
  authDomain: 'akshara-8630e.firebaseapp.com',
  databaseURL: 'https://akshara-8630e.firebaseio.com',
  projectId: 'akshara-8630e',
  storageBucket: 'akshara-8630e.appspot.com',
  messagingSenderId: '613661168552',
  appId: '1:613661168552:web:46b655f214b7d0bc18c39d',
  measurementId: 'G-23MFY9WDH7',

  watchedTimeout: 3000,
  realoadTimeoutAferSuccessPay: 5000,
  allowedWatchCount: 2,
  isProd: true,
  zoomURL: 'https://smsm-54fa3.web.app',
  paymentDisabled: false,
  techPhone: '0771141194',
  studentUpdateUrl: 'https://us-central1-akshara-8630e.cloudfunctions.net/akshara/studentupdate',
  dialogPaymentUrl: 'https://us-central1-akshara-8630e.cloudfunctions.net/akshara/dialogCharge',
  dialogConfirmUrl: 'https://us-central1-akshara-8630e.cloudfunctions.net/akshara/dialogConfirm',
  validatePaymentUrl: 'https://us-central1-akshara-8630e.cloudfunctions.net/akshara/validatePayment',

  payOnDismiss: false,
};

export default process.env.REACT_APP_ENV === 'dev' ? APP_CONFIG_DEV : APP_CONFIG_PROD;
// export default APP_CONFIG_PROD;

console.log(process.env.REACT_APP_ENV);
export const STUDENT_INFO_UPDATE = 'https://us-central1-akshara-8630e.cloudfunctions.net/akshara/studentupdate';
export const ADMIN_EMAIL = 'contact.akshara.lk@gmail.com';
export const OBS_DOWNLOAD = 'https://drive.google.com/file/d/1NOqkKwhl1FVuHE7Z52FB4qn7iE2U-_6b/view?usp=sharing';
export const OBS_HELP_DOC = '';
export const OBS_HELP_VIDEO = 'https://firebasestorage.googleapis.com/v0/b/akshara-8630e.appspot.com/o/admin%2F2020-10-26%2006-26-23.mp4?alt=media&token=8f4a2f91-5f8f-49a9-b9cc-8639cf1fa342';
export const AKSHARA_HELP_VIDEO = 'https://drive.google.com/file/d/1jWVH7JfI2mFp4QX72ADwveq2NVHusW4t/view?usp=sharing';
export const SAMPLE_DESKTOP_COVER = 'https://firebasestorage.googleapis.com/v0/b/akshara-8630e.appspot.com/o/admin%2FDesktopCover.png?alt=media&token=64a2527b-55e2-4ad7-9d65-5ee4fa1f5d89';
export const SAMPLE_MOBILE_COVER = 'https://firebasestorage.googleapis.com/v0/b/akshara-8630e.appspot.com/o/admin%2FMobileCover.png?alt=media&token=d7338c71-c45f-4d9d-8296-6e0f01fe75bd';
export const isTester = (email: string | undefined | null) => email === 'malindakpt@gmail.com' || email === 'rasikadri@gmail.com' || email === 'thusitha884@gmail.com' || email === 'contact.akshara.lk@gmail.com';
