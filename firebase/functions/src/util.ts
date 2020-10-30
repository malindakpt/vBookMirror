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
    LOGS = 'LOGS'
  }

export const getDocsWithProps = <T>(
  db: FirebaseFirestore.Firestore,
  entityName: Entity,
  conditions: any,
): Promise<T> => new Promise((resolves, reject) => {
    const ref = db.collection(entityName);
    let query: any;

    Object.keys(conditions).forEach((key) => {
      if ((key.includes('>') || key.includes('<'))
      ) {
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
