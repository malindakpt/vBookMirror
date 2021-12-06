import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Subject } from 'rxjs';
import appConfig from './Config';

let setLoading: (loading: boolean)=>void;

export const setStoreLoadingFunc = (func: (loading: boolean) => void) => {
  setLoading = func;
};
export interface UploadStatus {
  progress: number;
  uploadTask: firebase.storage.UploadTask;
  downloadURL?: string;
}

export enum FileType {
  VIDEO= 'VIDEO',
  AUDIO = 'AUDIO',
  IMAGE = 'IMAGE',
  PDF = 'PDF'
}

export enum Entity {
  USERS = 'USERS',
  TEACHERS = 'TEACHERS',
  COURSES = 'COURSES',
  EXAMS = 'EXAMS',
  ATTENDANCE = 'ATTENDANCE',
  LESSONS_PAPER = 'LESSONS_PAPER',
  LESSONS_VIDEO = 'LESSONS_VIDEO', // used by BE
  LESSONS_LIVE = 'LESSONS_LIVE', // used by BE
  SUBJECTS = 'SUBJECTS',
  PAYMENTS_STUDENTS = 'PAYMENTS', // used by BE
  LOGS = 'LOGS',
  STUDENT_INFO = 'STUDENT_INFO', // used by BE
  ACCESS_CODES = 'ACCESS_CODES',
  GIVEN_ACCESS_CODES = 'GIVEN_ACCESS_CODES',
  REPORTS = 'REPORTS'
}

const app = firebase.initializeApp(appConfig);
const db = firebase.firestore(app);
const storage = firebase.storage(app);

export const getVideo = (ownerEmail: string, vId: string): Promise<string> => new Promise((resolve) => {
  storage.ref().child('video').child(ownerEmail).child(vId)
    .getDownloadURL()
    .then((data) => resolve(data));
});

export const deleteVideo = (ownerEmail: string, vId: string): Promise<string> => new Promise((resolve) => {
  storage.ref().child('video').child(ownerEmail).child(vId)
    .delete()
    .then((data) => resolve(data));
});

export const listAllVideos = (ownerEmail: string)
    : Promise<firebase.storage.ListResult> => new Promise((resolve) => {
  storage.ref().child('video').child(ownerEmail).listAll()
    .then((data) => resolve(data));
});

export const listenFileChanges = <T>(entity: Entity, id: string, onChange: (file: T) => void) => {
  const unsubscribe = db.collection(entity).doc(id)
    .onSnapshot((doc) => {
      // const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server';
      onChange(doc.data() as T);
    });

  return unsubscribe;
};

export const uploadFileToServer = (fileType: FileType, file: any,
  email: string, fileId: string): Subject<UploadStatus> => {
  const subject = new Subject<UploadStatus>();
  const storageRef = storage.ref();

  // const blob = new Blob([file], { type: 'image/jpeg' });
  const uploadTask = storageRef.child(`teachers/${email}/${fileType}/${fileId}`).put(file);

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on('state_changed', (snapshot) => {
  // Observe state change events such as progress, pause, and resume
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    subject.next({
      uploadTask,
      progress,
    });
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        // console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        // console.log('Upload is running');
        break;
      default:
        console.error('unhandled');
    }
  }, (error) => {
  // Handle unsuccessful uploads
  }, () => {
  // Handle successful uploads on complete
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      // updateMeta(email, fileId);
      subject.next({
        uploadTask,
        progress: 100,
        downloadURL,
      });
    });
  });
  // // Pause the upload
  // uploadTask.pause();

  // // Resume the upload
  // uploadTask.resume();

  // // Cancel the upload
  // uploadTask.cancel();

  // setTimeout(() => {
  //   uploadTask.pause();
  // }, 5000);

  return subject;
};

export const addDoc = <T>(entityName: Entity, obj: T) => new Promise<string>((resolve, reject) => {
  const saveObj = { ...obj, createdAt: new Date().getTime() };
  // @ts-ignore
  delete saveObj.id; // Allow id auto generation and remove exsting id params

  db.collection(entityName).add(saveObj).then((docRef: any) => {
    resolve(docRef.id);
  }).catch((err) => {
    console.error(err);
    reject(err);
  });
});

export const deleteDoc = (entityName: Entity, id: string) => new Promise<boolean>((resolve, reject) => {
  db.collection(entityName).doc(id).delete().then(() => {
    resolve(true);
  })
    .catch((err) => {
      console.error(err);
      reject(err);
    });
});

export const addDocWithId = <T>(entityName: Entity, id: string, obj: T) => new Promise((resolve, reject) => {
  const saveObj = { ...obj, createdAt: new Date().getTime() };
  // @ts-ignore
  delete saveObj.id; // Allow id auto generation and remove exsting id params

  db.collection(entityName).doc(id).set(saveObj).then((data: any) => {
    resolve(true);
  })
    .catch((err) => {
      console.error(err);
      reject(err);
    });
});

export const updateDoc = (entityName: Entity, id: string, obj: any) => new Promise((resolve, reject) => {
  const saveObj = { ...obj, updatedAt: new Date().getTime() };
  // @ts-ignore
  delete saveObj.id; // Allow id auto generation and remove exsting id params

  db.collection(entityName).doc(id).update(saveObj).then((data: any) => {
    resolve(true);
  })
    .catch((err) => {
      console.error(err);
      reject(err);
    });
});

export const addOrUpdate = <T>(entityName: Entity, id: string, obj: T) => new Promise((resolve, reject) => {
  const saveObj = { ...obj, updatedAt: new Date().getTime() };

  db.collection(entityName).doc(id).set(saveObj, { merge: true }).then(() => {
    resolve(true);
  })
    .catch((err) => {
      console.error(err);
      reject(err);
    });
});

export const getDocsWithProps = <T>(
  entityName: Entity,
  conditions: Partial<T>,
  showLoading: boolean = true,
): Promise<T[]> => new Promise((resolves, reject) => {
    setLoading(showLoading);

    const ref = db.collection(entityName);
    let query: any;

    Object.keys(conditions).forEach((key) => {
      if ((key.includes('>') || key.includes('<'))
      ) {
        query = (query ?? ref).where(
          key.substring(0, key.length - 1),
          key.charAt(key.length - 1),
          conditions[key as keyof T],
        );
      } else if (key === 'limit') {
        query = (query ?? ref).limit(conditions[key as keyof T]);
      } else if (Array.isArray(conditions[key as keyof T])) {
        // @ts-ignore
        query = (query ?? ref).where(key, 'array-contains', conditions[key][0]);
      } else {
        query = (query ?? ref).where(key, '==', conditions[key as keyof T]);
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
        // Store result in cache and resolve
        // store[generateRequestKey(entityName, conditions)] = results;
        setLoading(false);
        resolves(results);
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
        reject(err);
      });
  });

export const getDocWithId = <T>(entityName: Entity, id: string, showLoading: boolean = true): Promise<T | null> => new Promise(
  (resolves, reject) => {
    setLoading(showLoading);
    db.collection(entityName).doc(id).get().then((doc: any) => {
      if (doc.exists) {
        const dat = doc.data();
        dat.id = id;
        setLoading(false);
        resolves(dat);
      } else {
        setLoading(false);
        resolves(null);
        console.error(`${entityName}: ${id} : No such document!`);
      }
    })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
        reject(err);
      });
  },
);

export const sendHttp = (url: string, body: object) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, createdAt: new Date().getTime() }),
  };
  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      }).catch((e) => reject(e));
  });
};
