import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import { Category } from '../../presentational/category/Category';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import {
  getDocsWithProps, addDoc, getDocWithId, Entity,
} from '../../../data/Store';
import { AppContext } from '../../../App';
import { ILesson, ILiveLesson, IVideoLesson } from '../../../interfaces/ILesson';
import { IUser } from '../../../interfaces/IUser';
import { ICourse } from '../../../interfaces/ICourse';
import { IPayment } from '../../../interfaces/IPayment';
import { AlertDialog, AlertMode } from '../../presentational/snackbar/AlertDialog';
import { paymentJS, startPay } from '../../../helper/payment';
import Config from '../../../data/Config';

export const Course: React.FC = () => {
  useBreadcrumb();

  const { email, showSnackbar } = useContext(AppContext);

  const { courseId } = useParams<any>(); // Two routest for this page. Consider both when reading params

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

  const readyToGoVideo = (lesson: ILesson) => (!lesson.price)
    || ((payments?.find((pay) => pay.lessonId
       === lesson.id && ((pay.watchedCount ?? 0) < Config.allowedWatchCount))));

  const readyToGoLive = (liveLess: ILiveLesson) => (!liveLess.price)
    || (payments?.find((pay) => pay.lessonId === liveLess.id));

  const checkPaymentStatus = async () => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    for (let i = 0; i < 3; i += 1) {
      console.log('payment status');
      // eslint-disable-next-line no-await-in-loop
      const payments = await getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, { ownerEmail: email });
      setPayments(payments);
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
    }
  };

  const handleLessonSelection = (lesson: ILesson, isLive: boolean) => {
    if (!email) {
      showSnackbar('Login using your gmail id');
      return;
    }

    if (readyToGoVideo(lesson)) {
      setDisplayAlert(isLive ? AlertMode.LIVE : AlertMode.VIDEO);
    } else {
      const dd = new Date().getTime();
      paymentJS.onDismissed = function onDismissed() {
        if (Config.isProd) {
          console.log('Payment Cancelled');
          showSnackbar('Payment Cancelled');
        } else {
          console.log('Succeed');
          addDoc(Entity.PAYMENTS_STUDENTS, { lessonId: lesson.id, ownerEmail: email });
          checkPaymentStatus();
          showSnackbar('Fake Dev Payment Succeed');
        }
      };

      paymentJS.onCompleted = function onCompleted() {
        console.log('Payment Succeed');
        showSnackbar('Payment Succeed. Updating payments');
        checkPaymentStatus();
      };
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
            if (readyToGoLive(live)) {
              status = 'yes';
            } else {
              status = 'no';
            }
          } else {
            status = 'none';
          }
          return (
            <div
              onClick={() => handleLessonSelection(live, true)}
              key={live.id}
              role="button"
              tabIndex={0}
              onKeyDown={() => handleLessonSelection(live, true)}
            >
              <Category
                id={live.id}
                CategoryImg={DesktopWindowsIcon}
                title1={`${live.topic}`}
                title2={`${live.description}`}
                title3={`${new Date(live.dateTime).toString().split('GMT')[0]}`}
                title5="Live"
                title6={`${live.duration} hrs`}
                navURL={accepted && readyToGoLive(live) ? `${courseId}/live/${live.id}` : `${courseId}`}
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
            if (readyToGoVideo(lesson)) {
              status = 'yes';
            } else {
              status = 'no';
            }
          } else {
            status = 'none';
          }

          return (
            <div
              onClick={() => handleLessonSelection(lesson, false)}
              key={idx}
              role="button"
              tabIndex={0}
              onKeyDown={() => handleLessonSelection(lesson, false)}
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
                navURL={readyToGoVideo(lesson)
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
