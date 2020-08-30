import firebase from 'firebase/app';
// import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './Config';

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

console.log('firebase initialized');

export const getDoc = (entity: string, id: string) => new Promise((resolve) => {
  const ref = db.collection(entity).doc(id);
  ref.get().then((data: any) => {
    resolve(data.data());
  }).catch((err) => {
    console.log(err);
    resolve([]);
  });
});

export const addDoc = (entity: string, obj: any) => new Promise((resolve) => {
  db.collection(entity).add(obj).then((data: any) => {
    resolve(true);
    alert(`${entity} is added`);
  }).catch((err) => {
    console.log(err);
    resolve(false);
  });
});
