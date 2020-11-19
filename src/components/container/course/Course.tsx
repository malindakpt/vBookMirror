import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { Category } from '../../presentational/category/Category';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import classes from './Course.module.scss';
import {
  getDocsWithProps, getDocWithId, Entity,
} from '../../../data/Store';
import { AppContext } from '../../../App';
import { ILesson, ILiveLesson, IVideoLesson } from '../../../interfaces/ILesson';
import { IUser } from '../../../interfaces/IUser';
import { ICourse } from '../../../interfaces/ICourse';
import { IPayment } from '../../../interfaces/IPayment';
import Config from '../../../data/Config';
import { ITeacher } from '../../../interfaces/ITeacher';
import {
  checkRefund, promptPayment, Util,
} from '../../../helper/util';
import { Banner } from '../../presentational/banner/Banner';

enum DisplayMode {
  ALL, VIDEO, LIVE
}

export const Course: React.FC = () => {
  useBreadcrumb();

  const { email, showSnackbar, showPaymentPopup } = useContext(AppContext);

  // Two routest for this page. (teacher profile)Consider both when reading params
  const { courseId } = useParams<any>();
  const [displayMode, setDisplayMOde] = useState<DisplayMode>(DisplayMode.ALL);

  const [videoLessons, setVideoLessons] = useState<IVideoLesson[]>([]);
  const [liveLessons, setLiveLessons] = useState<ILiveLesson[] | null>([]);

  const [payments, setPayments] = useState<IPayment[]>([]);

  const [teacher, setTeacher] = useState<ITeacher>();

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

  const amIOwnerOfLesson = (lesson: ILesson) => email === lesson.ownerEmail;

  const readyToGoVideo = (lesson: ILesson) => (!lesson.price)
    || ((payments?.find((pay) => pay.lessonId
       === lesson.id && ((pay.watchedCount ?? 0) < Config.allowedWatchCount))));

  const readyToGoLive = (liveLess: ILiveLesson) => (!liveLess.price)
    || (payments?.find((pay) => pay.lessonId === liveLess.id));

  const updatePayments = async (lessonId: string) => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    for (let i = 0; i < 5; i += 1) {
      console.log('payment status');

      // TODO : enhance this logic
      if (email && teacher) { checkRefund(email, lessonId, teacher.zoomMaxCount, showSnackbar); }

      // eslint-disable-next-line no-await-in-loop
      const myPayments = await getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, { ownerEmail: email });
      setPayments(myPayments);
      // eslint-disable-next-line no-await-in-loop
      await sleep(2000);
    }
  };

  const handleLessonSelection = (lesson: ILesson, isLive: boolean) => {
    if (!readyToGoVideo(lesson)) {
      if (!email) {
        // showSnackbar('Please login with your gmail address');
        Util.invokeLogin();
        return;
      }
      // teacher && promptPayment(email, teacher, lesson, isLive, updatePayments, showSnackbar);
      if (teacher) {
        showPaymentPopup({
          email,
          paidFor: teacher.ownerEmail,
          lesson,
          onSuccess: () => {},
          onCancel: () => {},
        });
      }
    }
  };

  const watchedCount = (lesson: ILesson) => payments?.find(
    (pay) => pay.lessonId === lesson.id)?.watchedCount ?? 0;

  const now = new Date().getTime();

  return (
    <div className="container">
      { teacher?.bannerUrl1 && (
      <Banner teacher={teacher} />
      )}
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <div>
          <RadioGroup
            className={classes.twoColumn}
            aria-label="editMode"
            name="editMode"
            value={displayMode}
            onChange={(e: any) => {
              setDisplayMOde(Number(e.target.value));
            }}
          >
            <FormControlLabel
              value={DisplayMode.ALL}
              control={<Radio />}
              label="All"
            />
            <FormControlLabel
              value={DisplayMode.VIDEO}
              control={<Radio />}
              label="Video"
            />
            <FormControlLabel
              value={DisplayMode.LIVE}
              control={<Radio />}
              label="Live"
            />
          </RadioGroup>
        </div>
      </form>
      {
       (displayMode === DisplayMode.ALL || displayMode === DisplayMode.LIVE)
            && liveLessons?.filter((le) => ((le.dateTime + 24 * 3600000) > now)).sort(
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
                title5="Zoom"
                title6={`${live.duration} hrs`}
                navURL={(readyToGoLive(live)
                  || amIOwnerOfLesson(live)) ? `${courseId}/live/${live.id}` : `${courseId}`}
                status={status}
              />
            </div>
          );
        })
      }
      {
        (displayMode === DisplayMode.ALL || displayMode === DisplayMode.VIDEO) && videoLessons?.map((lesson, idx) => {
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
                navURL={(readyToGoVideo(lesson)
                  || amIOwnerOfLesson(lesson)) ? `${courseId}/video/${lesson.id}` : `${courseId}`}
                status={status}
              />
            </div>
          );
        })
      }
    </div>
  );
};
