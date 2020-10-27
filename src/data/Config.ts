const APP_CONFIG_DEV = {
  apiKey: 'AIzaSyC5pq-lAQWmVEVmrI0iwQ2bUJvSKp4tXaY',
  authDomain: 'smsm-54fa3.firebaseapp.com',
  databaseURL: 'https://smsm-54fa3.firebaseio.com',
  projectId: 'smsm-54fa3',
  storageBucket: 'smsm-54fa3.appspot.com',
  messagingSenderId: '794082939900',
  appId: '1:794082939900:web:9967e6ea91936c2016d879',
  measurementId: 'G-4SS7PQK8D5',

  watchedTimeout: 3000,
  allowedWatchCount: 2,
  isProd: false,
  zoomURL: 'http://127.0.0.1:8887/',
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

  watchedTimeout: 20000,
  allowedWatchCount: 2,
  isProd: true,
  zoomURL: 'https://smsm-54fa3.web.app/',
};

export default process.env.REACT_APP_ENV === 'dev' ? APP_CONFIG_DEV : APP_CONFIG_PROD;

console.log(process.env.REACT_APP_ENV);

export const ADMIN_EMAIL = 'contact.akshara.lk@gmail.com';
export const OBS_DOWNLOAD = 'https://drive.google.com/file/d/1NOqkKwhl1FVuHE7Z52FB4qn7iE2U-_6b/view?usp=sharing';
export const OBS_HELP_DOC = '';
export const OBS_HELP_VIDEO = 'https://firebasestorage.googleapis.com/v0/b/akshara-8630e.appspot.com/o/admin%2F2020-10-26%2006-26-23.mp4?alt=media&token=8f4a2f91-5f8f-49a9-b9cc-8639cf1fa342';
