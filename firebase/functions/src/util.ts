export enum Entity {
  USERS = 'USERS',
  TEACHERS = 'TEACHERS',
  COURSES = 'COURSES',
  EXAMS = 'EXAMS',
  LESSONS_VIDEO = 'LESSONS_VIDEO', // used by BE
  LESSONS_LIVE = 'LESSONS_LIVE', // used by BE
  SUBJECTS = 'SUBJECTS',
  PAYMENTS_STUDENTS = 'PAYMENTS_STUDENTS', // used by BE
  PAYMENTS_TEACHER = 'PAYMENTS_TEACHER',
  LOGS = 'LOGS',
  STUDENT_INFO = 'STUDENT_INFO', // used by BE
}

export enum StatusType {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  MOBITEL_SUCCESS = 1000,
  MOBITEL_ERROR = 1009,
}

export const getDocsWithProps = <T>(
  db: FirebaseFirestore.Firestore,
  entityName: Entity,
  conditions: any,
): Promise<T> => new Promise((resolves, reject) => {
    const ref = db.collection(entityName);
    let query: any;

    Object.keys(conditions).forEach((key) => {
      if (key.includes('>') || key.includes('<')) {
        query = (query ?? ref).where(
          key.substring(0, key.length - 1),
          key.charAt(key.length - 1),
          conditions[key],
        );
      } else if (key === 'limit') {
        query = (query ?? ref).limit(conditions[key]);
      } else if (Array.isArray(conditions[key])) {
        query = (query ?? ref).where(key, 'array-contains', conditions[key][0]);
      } else {
        query = (query ?? ref).where(key, '==', conditions[key]);
      }
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
      .catch((err: any) => {
        console.error(err);
        reject(err);
      });
  });

export const updateDoc = (
  db: FirebaseFirestore.Firestore,
  entityName: Entity,
  id: string,
  obj: any,
) => new Promise((resolve, reject) => {
  const saveObj = { ...obj, updatedAt: new Date().getTime() };
  // @ts-ignore
  delete saveObj.id; // Allow id auto generation and remove exsting id params

  db.collection(entityName)
    .doc(id)
    .update(saveObj)
    .then((data: any) => {
      resolve(true);
    })
    .catch((err) => {
      console.error(err);
      reject(err);
    });
});

export const deleteDoc = (
  db: FirebaseFirestore.Firestore,
  entityName: Entity,
  id: string,
) => new Promise<boolean>((resolve, reject) => {
  db.collection(entityName)
    .doc(id)
    .delete()
    .then(() => {
      resolve(true);
    })
    .catch((err) => {
      console.error(err);
      reject(err);
    });
});

export const sendError = (res: any, text: any) => {
  console.error(text);
  res.send({ status: StatusType.ERROR, message: text });
};

export const sendSuccess = (res: any, text: any) => {
  console.log(text);
  res.send({ status: StatusType.SUCCESS, message: text });
};
