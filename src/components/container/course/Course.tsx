import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import DescriptionIcon from '@material-ui/icons/Description';
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { Category } from '../../presentational/category/Category';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import classes from './Course.module.scss';
import {
  getDocsWithProps, getDocWithId, Entity,
} from '../../../data/Store';
import { AppContext } from '../../../App';
import {
  ILesson, ILiveLesson, IPaperLesson, IVideoLesson,
} from '../../../interfaces/ILesson';
import { IUser } from '../../../interfaces/IUser';
import { ICourse } from '../../../interfaces/ICourse';
import { IPayment } from '../../../interfaces/IPayment';
import Config from '../../../data/Config';
import { ITeacher } from '../../../interfaces/ITeacher';
import {
  readyToGo, Util,
} from '../../../helper/util';
import { Banner } from '../../presentational/banner/Banner';

export enum ModuleType {
  ANY, VIDEO, LIVE, PAPER
}

export const Course: React.FC = () => {
  useBreadcrumb();

  const { email, showPaymentPopup } = useContext(AppContext);

  // Two routest for this page. (teacher profile)Consider both when reading params
  const { courseId } = useParams<any>();
  const [displayMode, setDisplayMOde] = useState<ModuleType>(ModuleType.ANY);

  const [videoLessons, setVideoLessons] = useState<IVideoLesson[]>([]);
  const [liveLessons, setLiveLessons] = useState<ILiveLesson[] | null>([]);
  const [mcqPapers, setMcqPapers] = useState<IPaperLesson[]>([]);

  const [payments, setPayments] = useState<IPayment[]>([]);

  const [teacher, setTeacher] = useState<ITeacher>();

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
      getDocsWithProps<IPaperLesson[]>(Entity.LESSONS_PAPER, { courseId }),
      getDocWithId<ICourse>(Entity.COURSES, courseId),
    ]).then((result) => {
      const [videoLessons, liveLessons, mcqPapers, course] = result;

      const orderedVL: IVideoLesson[] = [];
      course?.videoLessonOrder?.forEach((c) => {
        const videoLessonObj = videoLessons?.find((vl) => vl.id === c);
        videoLessonObj && orderedVL.push(videoLessonObj);
      });
      setVideoLessons(orderedVL);
      setLiveLessons(liveLessons);
      // course && setCourse(course);
      setMcqPapers(mcqPapers ?? []);

      course && getDocWithId<ITeacher>(Entity.TEACHERS, course.ownerEmail).then((teacher) => {
        teacher && setTeacher(teacher);
      });
    });
    // eslint-disable-next-line
  }, [email]);

  const amIOwnerOfLesson = (lesson: ILesson) => email === lesson.ownerEmail;

  // TODO: Memory leek here when user make payment and open the lesson, stil this thread is alive
  const updatePayments = async () => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    for (let i = 0; i < 5; i += 1) {
      console.log('payment status');

      // TODO : enhance this logic
      // if (email && teacher) { checkRefund(email, le, teacher.zoomMaxCount, showSnackbar); }

      // eslint-disable-next-line no-await-in-loop
      const myPayments = await getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, { ownerEmail: email });
      setPayments(myPayments);
      // eslint-disable-next-line no-await-in-loop
      await sleep(2000);
    }
  };

  const handleLessonSelection = (lesson: ILesson) => {
    if (!readyToGo(payments, lesson).ok) {
      if (!email) {
        // showSnackbar('Please login with your gmail address');
        Util.invokeLogin();
        return;
      }
      if (teacher) {
        showPaymentPopup({
          email,
          paidFor: teacher.ownerEmail,
          lesson,
          teacher,
          onSuccess: updatePayments,
          onCancel: () => {},
        });
      }
      // teacher && promptPayment(email, teacher, lesson, paymentType, updatePayments, showSnackbar);
    }
  };

  // If multiple payments exists, get the lowest watch count payment
  const watchedCount = (lesson: ILesson) => payments?.find(
      (pay) => (pay.lessonId === lesson.id) && !pay.disabled)?.watchedCount ?? 0;

  const now = new Date().getTime();

  return (
    <div className="container">
      { teacher && (
        <Banner teacher={teacher} />
      )}
      <form
        className={classes.filter}
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
              value={ModuleType.ANY}
              control={<Radio />}
              label="All"
            />
            <FormControlLabel
              value={ModuleType.VIDEO}
              control={<Radio />}
              label="Video"
            />
            <FormControlLabel
              value={ModuleType.PAPER}
              control={<Radio />}
              label="Paper"
            />
            <FormControlLabel
              value={ModuleType.LIVE}
              control={<Radio />}
              label="Live"
            />
          </RadioGroup>
        </div>
      </form>
      {
        (displayMode === ModuleType.ANY || displayMode === ModuleType.LIVE)
        && liveLessons?.filter((le) => ((le.dateTime + 12 * 3600000) > now)).sort(
          (a, b) => a.dateTime - b.dateTime,
        ).map((live) => {
          let status: 'yes' | 'no' | 'none' | undefined;
          if (live.price) {
            if (readyToGo(payments, live).ok) {
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
              onClick={() => handleLessonSelection(live)}
              key={live.id}
              role="button"
              tabIndex={0}
              onKeyDown={() => handleLessonSelection(live)}
            >
              <Category
                id={live.id}
                CategoryImg={DesktopWindowsIcon}
                title1={`${live.topic}`}
                title2={`${live.description}`}
                title3={timeF}
                title5="Zoom"
                title6={`${live.duration} hrs`}
                navURL={(readyToGo(payments, live).ok
                  || amIOwnerOfLesson(live)) ? `${courseId}/live/${live.id}` : `${courseId}`}
                status={status}
              />
            </div>
          );
        })
      }
      {
        (displayMode === ModuleType.ANY
          || displayMode === ModuleType.VIDEO) && videoLessons?.map((lesson, idx) => {
            let status: 'yes' | 'no' | 'none' | undefined;
            if (lesson.price) {
              if (readyToGo(payments, lesson).ok) {
                status = 'yes';
              } else {
                status = 'no';
              }
            } else {
              status = 'none';
            }

            return (
              <div
                onClick={() => handleLessonSelection(lesson)}
                key={idx}
                role="button"
                tabIndex={0}
                onKeyDown={() => handleLessonSelection(lesson)}
              >
                <Category
                  id={lesson.id}
                  key={idx}
                  CategoryImg={OndemandVideoIcon}
                  title1={`${lesson.topic}`}
                  title2={`${lesson.description}`}
                  title3={lesson.price > 0
                    ? `Watched: ${watchedCount(lesson)}/${Config.allowedWatchCount}` : 'Free'}
                  navURL={(readyToGo(payments, lesson).ok
                    || amIOwnerOfLesson(lesson)) ? `${courseId}/video/${lesson.id}` : `${courseId}`}
                  status={status}
                />
              </div>
            );
          })
      }

      {
        (displayMode === ModuleType.ANY
          || displayMode === ModuleType.PAPER)
          && mcqPapers.sort((a, b) => a.orderIndex - b.orderIndex)?.map((paper, idx) => {
            let status: 'yes' | 'no' | 'none' | undefined;
            if (paper.price) {
              if (readyToGo(payments, paper).ok) {
                status = 'yes';
              } else {
                status = 'no';
              }
            } else {
              status = 'none';
            }

            return (
              <div
                onClick={() => handleLessonSelection(paper)}
                key={idx}
                role="button"
                tabIndex={0}
                onKeyDown={() => handleLessonSelection(paper)}
              >
                <Category
                  id={paper.id}
                  key={idx}
                  CategoryImg={DescriptionIcon}
                  title1={`${paper.topic}`}
                  title2={`${paper.description}`}
                  title3={paper.price > 0
                    ? `Watched: ${watchedCount(paper)}/${Config.allowedWatchCount}` : 'Free'}
                  navURL={(readyToGo(payments, paper).ok
                    || amIOwnerOfLesson(paper)) ? `${courseId}/paper/${paper.id}` : `${courseId}`}
                  status={status}
                />
              </div>
            );
          })
      }
    </div>
  );
};
