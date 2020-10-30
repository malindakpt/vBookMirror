import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import { Category } from '../../presentational/category/Category';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import {
  getDocsWithProps, addDoc, updateDoc, getDocWithId, Entity, addDocWithId,
} from '../../../data/Store';
import { AppContext } from '../../../App';
import { ILesson, ILiveLesson, IVideoLesson } from '../../../interfaces/ILesson';
import { IUser } from '../../../interfaces/IUser';
import { ICourse } from '../../../interfaces/ICourse';
import { IPayment } from '../../../interfaces/IPayment';
import { AlertDialog, AlertMode } from '../../presentational/snackbar/AlertDialog';
import { paymentJS, startPay } from '../../../helper/payment';
import Config from '../../../data/Config';
import { isLiveLessonRunning } from '../../../helper/util';

export const Course: React.FC = () => {
  useBreadcrumb();

  const [user, setUser] = useState<IUser>();
  const { email, showSnackbar } = useContext(AppContext);

  const { courseId } = useParams<any>(); // Two routest for this page. Consider both when reading params
  // const [course, setCourse] = useState<ICourse>();

  const [videoLessons, setVideoLessons] = useState<IVideoLesson[]>([]);
  const [liveLessons, setLiveLessons] = useState<ILiveLesson[] | null>([]);

  const [payments, setPayments] = useState<IPayment[]>([]);

  const [accepted, setAccepted] = useState<boolean>(false);
  const [displayAlert, setDisplayAlert] = useState<AlertMode>(AlertMode.NONE);

  useEffect(() => {
    getDocsWithProps<IUser[]>(Entity.USERS, { ownerEmail: email }).then((user) => {
      if (user) {
        getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, { ownerEmail: email }).then((payments) => {
          setPayments(payments);
        });
      }
    });

    Promise.all([
      getDocsWithProps<IVideoLesson[]>(Entity.LESSONS_VIDEO, { courseId }),
      getDocsWithProps<ILiveLesson[]>(Entity.LESSONS_LIVE, { courseId }),
      getDocWithId<ICourse>(Entity.COURSES, courseId),
    ]).then((result) => {
      const [videoLessons, liveLessons, course] = result;

      const orderedVL: IVideoLesson[] = [];
      course?.lessons?.forEach((c) => {
        const videoLessonObj = videoLessons?.find((vl) => vl.id === c);
        videoLessonObj && orderedVL.push(videoLessonObj);
      });
      setVideoLessons(orderedVL);
      setLiveLessons(liveLessons);
    });
    // eslint-disable-next-line
  }, [email]);

  const freeOrPurchased = (lesson: ILesson) => (!lesson.price)
    || ((payments?.find((pay) => pay.lessonId
       === lesson.id && ((pay.watchedCount ?? 0) < Config.allowedWatchCount))));

  const readyToGo = (liveLess: ILiveLesson) => (!liveLess.price)
    || (payments?.find((pay) => pay.lessonId === liveLess.id));

  // const handlePaymentSuccess = async (amount: number, date: number, lessonId: string, isLive: boolean) => {
  //   if (!email) return;

  //   let editableUser = user;

  //   if (!editableUser) {
  //     editableUser = {
  //       id: email,
  //       ownerEmail: email,
  //       videoLessons: [],
  //       liveLessons: [],
  //     };
  //   }
  //   const lesson = isLive ? liveLessons.find((l) => l.id === lessonId) : videoLessons.find((l) => l.id === lessonId);

  //   if (!lesson) return;

  //   const paymentRef = await addDoc<Omit<IPayment, 'id'>>(Entity.PAYMENTS_STUDENTS, {
  //     amount, date, ownerEmail: email, paidFor: lesson.ownerEmail, lessonId,
  //   });

  //   const lessonArray = isLive ? editableUser.liveLessons : editableUser.videoLessons;
  //   // TODO: remove old purchases at here
  //   const alreadyPurchased = lessonArray?.findIndex((sub) => sub.id === lesson.id);
  //   if (!isLive && alreadyPurchased > -1) {
  //     lessonArray[alreadyPurchased].watchedCount = 0;
  //     lessonArray[alreadyPurchased].paymentRef = paymentRef;
  //   } else {
  //     if (lessonArray) {
  //       lessonArray.push({
  //         id: lessonId,
  //         paymentRef,
  //         watchedCount: 0,
  //       });
  //     } else {
  //       if (isLive) {
  //         editableUser.liveLessons = [{
  //           id: lessonId,
  //           paymentRef,
  //           watchedCount: 0,
  //         }];
  //       } else {
  //         editableUser.videoLessons = [{
  //           id: lessonId,
  //           paymentRef,
  //           watchedCount: 0,
  //         }];
  //       }
  //     }
  //   }
  //   // This fails(permission), non product owners tries to edit value
  //   // updateDoc(Entity.LESSONS, lessonId, { subCount: firebase.firestore.FieldValue.increment(1) });

  //   if (user) {
  //     updateDoc(Entity.USERS, editableUser.id, editableUser).then(() => {
  //       setUser(editableUser);
  //       showSnackbar('Payment success');
  //     });
  //   } else { // this check is to fix ts issue below
  //     addDocWithId(Entity.USERS, editableUser.ownerEmail, editableUser).then(() => {
  //       setUser(editableUser);
  //       showSnackbar('Payment success');
  //     });
  //   }
  // };

  const handleVideoSelectLesson = (lesson: ILesson) => {
    if (freeOrPurchased(lesson)) {
      setDisplayAlert(AlertMode.VIDEO);
    } else {
      const dd = new Date().getTime();
      // Handle dismiss
      paymentJS.onDismissed = function onDismissed() {
        // Note: Prompt user to pay again or show an error page
        // TODO: Remove this code

        if (Config.isProd) {
          console.log('Payment Cancelled');
          showSnackbar('Payment Cancelled');
        } else {
          console.log('Succeed');
          showSnackbar('Dev Payment Succeed');
          // handlePaymentSuccess(lesson.price, dd, lesson.id, false);
        }
        // handlePaymentSuccess(lesson.price, dd, lesson.id);
      };

      // Handle onComplete
      paymentJS.onCompleted = function onCompleted() {
        // Note: Prompt user to pay again or show an error page
        // TODO: Remove this code
        console.log('Payment Succeed');
        showSnackbar('Payment Succeed');
        // handlePaymentSuccess(lesson.price, dd, lesson.id, false);
      };

      // Show payment dialog
      startPay(email, lesson.id, lesson.price, dd);
    }
  };

  const handleLiveSelectLesson = (lesson: ILiveLesson) => {
    if (readyToGo(lesson)) {
      setDisplayAlert(AlertMode.LIVE);
    } else {
      const dd = new Date().getTime();
      paymentJS.onDismissed = function onDismissed() {
        // Note: Prompt user to pay again or show an error page
        // TODO: Remove this code
        if (Config.isProd) {
          console.log('Payment Cancelled');
          showSnackbar('Payment Cancelled');
        } else {
          console.log('Fake Dev Payment Succeed');
          showSnackbar('Fake Dev Payment Succeed');
          // handlePaymentSuccess(lesson.price, dd, lesson.id, true);
        }
      };
      paymentJS.onCompleted = function onDismissed() {
        // Note: Prompt user to pay again or show an error page
        // TODO: Remove this code
        console.log('Payment Succeed');
        showSnackbar('Payment Succeed');
        // handlePaymentSuccess(lesson.price, dd, lesson.id, true);
      };

      // Show payment dialog
      startPay(email, lesson.id, lesson.price, dd);
    }
  };

  const watchedCount = (lesson: ILesson) => payments?.find(
    (pay) => pay.lessonId === lesson.id)?.watchedCount ?? 0;

  return (
    <div className="container">
      {
        liveLessons?.sort(
          (a, b) => a.dateTime - b.dateTime,
        ).map((live) => {
          let status: 'yes' | 'no' | 'none' | undefined;
          if (live.price) {
            if (readyToGo(live)) {
              status = 'yes';
            } else {
              status = 'no';
            }
          } else {
            status = 'none';
          }
          return (
            <div
              onClick={() => handleLiveSelectLesson(live)}
              key={live.id}
              role="button"
              tabIndex={0}
              onKeyDown={() => handleVideoSelectLesson(live)}
            >
              <Category
                id={live.id}
                CategoryImg={DesktopWindowsIcon}
                title1={`${live.topic}`}
                title2={`${live.description}`}
                title3={`${new Date(live.dateTime).toString().split('GMT')[0]}`}
                title5="Live"
                title6={`${live.duration} hrs`}
                navURL={accepted && readyToGo(live) ? `${courseId}/live/${live.id}` : `${courseId}`}
                status={status}
              />
            </div>
          );
        })
      }
      {
        videoLessons?.map((lesson, idx) => {
          let status: 'yes' | 'no' | 'none' | undefined;
          if (lesson.price) {
            if (freeOrPurchased(lesson)) {
              status = 'yes';
            } else {
              status = 'no';
            }
          } else {
            status = 'none';
          }

          return (
            <div
              onClick={() => handleVideoSelectLesson(lesson)}
              key={idx}
              role="button"
              tabIndex={0}
              onKeyDown={() => handleVideoSelectLesson(lesson)}
            >
              <Category
                id={lesson.id}
                key={idx}
                CategoryImg={OndemandVideoIcon}
                title1={`${lesson.topic}`}
                title2={`${lesson.description}`}
                title3={lesson.price > 0
                  ? `Watched: ${watchedCount(lesson)}/${Config.allowedWatchCount}` : 'Free'}
                title6={`${lesson.duration} mins`}
                navURL={freeOrPurchased(lesson)
                   && (accepted || lesson.price === 0) ? `${courseId}/video/${lesson.id}` : `${courseId}`}
                status={status}
              />
            </div>
          );
        })
      }

      {displayAlert !== AlertMode.NONE && !accepted && (
      <AlertDialog
        type={displayAlert}
        onAccept={() => {
          setAccepted(true);
        }}

        onCancel={() => {
          setAccepted(false);
          setDisplayAlert(AlertMode.NONE);
        }}
      />
      )}
    </div>
  );
};
