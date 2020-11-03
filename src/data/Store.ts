import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Subject } from 'rxjs';
import appConfig from './Config';

export interface UploadStatus {
  progress: number;
  uploadTask: firebase.storage.UploadTask;
  downloadURL?: string;
}

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
  REFUND_REQUESTS = 'REFUND_REQUESTS',
  LOGS = 'LOGS'
}

const app = firebase.initializeApp(appConfig);
const db = firebase.firestore(app);
const storage = firebase.storage(app);
// const store: {[key: string]: any} = {};

// const clearStore = (entityName: string) => {
//   for (const key of Object.keys(store)) {
//     if (key.startsWith(entityName)) {
//       store[key] = null;
//     }
//   }
// };

// TODO: clear data store for all edit data queries

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

export const updateMeta = (email: string, vId: string) => {
  const storageRef = storage.ref();
  // Create a reference to the file whose metadata we want to change
  const forestRef = storageRef.child(`video/${email}/${vId}`);

  // Create file metadata to update
  const newMetadata = {
    contentType: 'image/jpeg',
  };

  // Update metadata properties
  forestRef.updateMetadata(newMetadata).then((metadata) => {
    // Updated metadata for 'images/forest.jpg' is returned in the Promise
  }).catch((error) => {
    console.error(error);
  // Uh-oh, an error occurred!
  });
};

export const uploadVideoToServer = (file: any, email: string, vId: string): Subject<UploadStatus> => {
  const subject = new Subject<UploadStatus>();
  const storageRef = storage.ref();

  // const blob = new Blob([file], { type: 'image/jpeg' });
  const uploadTask = storageRef.child(`video/${email}/${vId}`).put(file);

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
      updateMeta(email, vId);
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
  const saveObj = { ...obj };
  // @ts-ignore
  delete saveObj.id; // Allow id auto generation and remove exsting id params

  db.collection(entityName).add(saveObj).then((docRef: any) => {
    // console.log(docRef.id);
    // clearStore(entityName);
    resolve(docRef.id);
  }).catch((err) => {
    console.error(err);
    reject(err);
  });
});

export const deleteDoc = (entityName: Entity, id: string) => new Promise<boolean>((resolve, reject) => {
  db.collection(entityName).doc(id).delete().then(() => {
    // clearStore(entityName);
    resolve(true);
  })
    .catch((err) => {
      console.error(err);
      reject(err);
    });
});

export const addDocWithId = <T>(entityName: Entity, id: string, obj: T) => new Promise((resolve, reject) => {
  const saveObj = { ...obj };
  // @ts-ignore
  delete saveObj.id; // Allow id auto generation and remove exsting id params

  db.collection(entityName).doc(id).set(saveObj).then((data: any) => {
    // clearStore(entityName);
    resolve(true);
  })
    .catch((err) => {
      console.error(err);
      reject(err);
    });
});

export const updateDoc = (entityName: Entity, id: string, obj: any) => new Promise((resolve, reject) => {
  const saveObj = { ...obj };
  // @ts-ignore
  delete saveObj.id; // Allow id auto generation and remove exsting id params
  db.collection(entityName).doc(id).update(saveObj).then((data: any) => {
    // clearStore(entityName);
    resolve(true);
  })
    .catch((err) => {
      console.error(err);
      reject(err);
    });
});

// const generateRequestKey = (
//   entityName: string, conditions: any,
// ) => `${entityName}-${JSON.stringify(conditions)}}`;

export const getDocsWithProps = <T>(
  entityName: Entity,
  conditions: any,
): Promise<T> => new Promise((resolves, reject) => {
    // const cachedResponse = store[generateRequestKey(entityName, conditions)];
    // if (cachedResponse) {
    //   // Resolve result from cache and skip network
    //   console.log('ch');
    //   resolves(cachedResponse);
    //   return;
    // }

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
        // Store result in cache and resolve
        // store[generateRequestKey(entityName, conditions)] = results;
        resolves(results);
      })
      .catch((err: any) => {
        console.error(err);
        reject(err);
      });
  });

export const getDocWithId = <T>(entityName: Entity, id: string): Promise<T | null> => new Promise(
  (resolves, reject) => {
    db.collection(entityName).doc(id).get().then((doc: any) => {
      if (doc.exists) {
        const dat = doc.data();
        dat.id = id;
        resolves(dat);
      } else {
        resolves(null);
        console.error(`${entityName}: ${id} : No such document!`);
      }
    })
      .catch((err: any) => {
        console.error(err);
        reject(err);
      });
  },
);
