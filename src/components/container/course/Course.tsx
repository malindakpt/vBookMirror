import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import * as firebase from 'firebase/app';
import { Category } from '../../presentational/category/Category';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import {
  getDocsWithProps, addDoc, getDocWithId, Entity, updateDoc,
} from '../../../data/Store';
import { AppContext } from '../../../App';
import { ILesson, ILiveLesson, IVideoLesson } from '../../../interfaces/ILesson';
import { IUser } from '../../../interfaces/IUser';
import { ICourse } from '../../../interfaces/ICourse';
import { IPayment } from '../../../interfaces/IPayment';
import { AlertDialog, AlertMode } from '../../presentational/snackbar/AlertDialog';
import { paymentJS, startPay } from '../../../helper/payment';
import Config from '../../../data/Config';
import { ITeacher } from '../../../interfaces/ITeacher';
import { checkRefund } from '../../../helper/util';

export const Course: React.FC = () => {
  useBreadcrumb();

  const { email, showSnackbar } = useContext(AppContext);

  // Two routest for this page. (teacher profile)Consider both when reading params
  const { courseId } = useParams<any>();
  // const [course, setCourse] = useState<ICourse>();

  const [videoLessons, setVideoLessons] = useState<IVideoLesson[]>([]);
  const [liveLessons, setLiveLessons] = useState<ILiveLesson[] | null>([]);

  const [payments, setPayments] = useState<IPayment[]>([]);

  const [accepted, setAccepted] = useState<boolean>(false);
  const [displayAlert, setDisplayAlert] = useState<AlertMode>(AlertMode.NONE);

  // const [payLesson, setPayLesson] = useState<ILesson>();
  const [teacher, setTeacher] = useState<ITeacher>();
  // const [refundPayment, setRefundPayment] = useState<IPayment>();

  useEffect(() => {
    getDocsWithProps<IUser[]>(Entity.USERS, { ownerEmail: email }).then((user) => {
      if (user) {
        getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, { ownerEmail: email }).then((payments) => {
          setPayments(payments.filter((p) => !p.disabled));
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
      course?.videoLessonOrder?.forEach((c) => {
        const videoLessonObj = videoLessons?.find((vl) => vl.id === c);
        videoLessonObj && orderedVL.push(videoLessonObj);
      });
      setVideoLessons(orderedVL);
      setLiveLessons(liveLessons);
      // course && setCourse(course);

      course && getDocWithId<ITeacher>(Entity.TEACHERS, course.ownerEmail).then((teacher) => {
        teacher && setTeacher(teacher);
      });
    });
    // eslint-disable-next-line
  }, [email]);

  const readyToGoVideo = (lesson: ILesson) => (!lesson.price)
    || ((payments?.find((pay) => pay.lessonId
       === lesson.id && ((pay.watchedCount ?? 0) < Config.allowedWatchCount))));

  const readyToGoLive = (liveLess: ILiveLesson) => (!liveLess.price)
    || (payments?.find((pay) => pay.lessonId === liveLess.id));

  const updatePayments = async (lessonId: string) => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    for (let i = 0; i < 3; i += 1) {
      console.log('payment status');

      // TODO : enhance this logic
      if (email && teacher) { checkRefund(email, lessonId, teacher.zoomMaxCount, showSnackbar); }

      // eslint-disable-next-line no-await-in-loop
      const myPayments = await getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, { ownerEmail: email });
      setPayments(myPayments);
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
    }
  };

  const handleLessonSelection = (lesson: ILesson, isLive: boolean) => {
    if (!email) {
      showSnackbar('Please login with your gmail address');
      return;
    }

    if (readyToGoVideo(lesson)) {
      setDisplayAlert(isLive ? AlertMode.LIVE : AlertMode.VIDEO);
    } else {
      const dd = new Date().getTime();
      paymentJS.onDismissed = function onDismissed() {
        if (Config.isProd) {
          console.log('Payment Dismissed');
          showSnackbar('Payment Dismissed. Please refrsh the page after few seconds to update payments');
          updatePayments(lesson.id);
        } else {
          console.log('Succeed');
          /// /////////FAKE UPDATE START////////////
          addDoc(Entity.PAYMENTS_STUDENTS, { lessonId: lesson.id, ownerEmail: email });
          const entity = isLive ? Entity.LESSONS_LIVE : Entity.LESSONS_VIDEO;
          updateDoc(entity, lesson.id, { subCount: firebase.firestore.FieldValue.increment(1) });
          updatePayments(lesson.id);
          /// ////////FAKE UPDATE END///////////////
          showSnackbar('Fake Dev Payment Succeed');
        }
      };

      paymentJS.onCompleted = function onCompleted() {
        console.log('Payment Succeed');
        showSnackbar('Payment Succeed. Updating payments');
        updatePayments(lesson.id);
      };

      if (isLive) {
        // course && getDocWithId<ITeacher>(Entity.TEACHERS, course?.ownerEmail).then((teacher) => {
        if (teacher) {
          getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, { lessonId: lesson.id }).then((data) => {
            if (data && data.length >= teacher.zoomMaxCount) {
              // TODO: send a notification to teacher
              showSnackbar('This live session is full. Please contact the teacher');
            } else {
              // setPayLesson(lesson);
              startPay(email, lesson.id, lesson.price, dd);
            }
          });
        }
        // });
      } else {
        startPay(email, lesson.id, lesson.price, dd);
      }
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
          const time = new Date(live.dateTime).toString().split('GMT')[0];
          const timeF = time.substring(0, time.length - 4);
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
                title3={timeF}
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
