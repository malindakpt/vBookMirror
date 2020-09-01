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

export const updateDoc = (entity: string, id: string, obj: any) => new Promise((resolve) => {
  db.collection(entity).doc(id).update(obj).then((data: any) => {
    resolve(true);
    alert(`${entity} is updated`);
  })
    .catch((err) => {
      console.log(err);
      resolve(false);
    });
});

export const getDocsWithProps = (
  entityName: string,
  conditions: any,
  orderBy: any,
  skipBusy?: boolean,
): Promise<any> => {
  console.log(`Requesting entity: ${entityName}`, conditions);
  const requestStatus = { isCompleted: false };

  return new Promise((resolves, reject) => {
    const ref = db.collection(entityName);
    let query: any;

    Object.keys(conditions).forEach((key, index) => {
      if (
        typeof conditions[key] === 'string'
        && (conditions[key].includes('>') || conditions[key].includes('<'))
      ) {
        query = (query ?? ref).where(
          key,
          conditions[key].charAt(0),
          conditions[key].substring(1),
        );
      } else if (key === 'limit') {
        query = (query ?? ref).limit(conditions[key]);
      } else if (Array.isArray(conditions[key])) {
        query = (query ?? ref).where(key, 'array-contains', conditions[key][0]);
      } else {
        query = (query ?? ref).where(key, '==', conditions[key]);
      }
    });

    Object.keys(orderBy).forEach((key, index) => {
      query = (query ?? ref).orderBy(key, orderBy[key]);
    });

    const results: any = [];
    (query ?? ref)
      .get()
      .then((querySnapshot: any) => {
        querySnapshot.forEach((doc: any) => {
          const v = doc.data();
          v.id = doc.id;
          results.push(v);
        });
        resolves(results);
      })
      .catch((error: any) => {
        resolves(null);
      });
  });
};
