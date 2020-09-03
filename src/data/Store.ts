import firebase from 'firebase/app';
import 'firebase/firestore';
import firebaseConfig from './Config';

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

console.log('firebase initialized');

// const

export const addDoc = (entity: string, obj: any) => new Promise((resolve) => {
  db.collection(entity).add(obj).then((data: any) => {
    resolve(true);
  }).catch((err) => {
    console.log(err);
    resolve(false);
  });
});

export const updateDoc = (entity: string, id: string, obj: any) => new Promise((resolve) => {
  db.collection(entity).doc(id).update(obj).then((data: any) => {
    resolve(true);
  })
    .catch((err) => {
      console.log(err);
      resolve(false);
    });
});

const store: {[key: string]: any} = {};

const generateRequestKey = (entityName: string,
  conditions: any,
  orderBy: any) => `${entityName}-${JSON.stringify(conditions)}-${JSON.stringify(orderBy)}`;

export const getDocsWithProps = (
  entityName: string,
  conditions: any,
  orderBy: any,
): Promise<any> => new Promise((resolves, reject) => {
  const cachedResponse = store[generateRequestKey(entityName, conditions, orderBy)];
  if (cachedResponse) {
    // Resolve result from cache and skip network
    resolves(cachedResponse);
    return;
  }

  const ref = db.collection(entityName);
  let query: any;

  Object.keys(conditions).forEach((key) => {
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
      // Store result in cache and resolve
      store[generateRequestKey(entityName, conditions, orderBy)] = results;
      resolves(results);
    })
    .catch((error: any) => {
      resolves(null);
    });
});
