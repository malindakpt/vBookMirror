import React, { useContext } from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import classes from './Router.module.scss';
import { Exams } from '../container/exams/Exams';
import { Subjects } from '../container/subjects/Subjects';
import { Courses } from '../container/courses/Courses';
import { Course } from '../container/course/Course';
import { Storage } from '../container/storage/Storage';
import { BreadcrumbBar } from '../presentational/breadcrumbs/BreadcrumbBar';
import { AddVideoLesson } from '../container/addLesson/addVideoLesson/AddVideoLesson';
import { AddSubject } from '../container/manageCourse/addSubject/AddSubject';
import { EditExam } from '../container/manageCourse/editExam/EditExam';
import { AddExam } from '../container/manageCourse/addExam/AddExam';
import { AddTeacher } from '../container/manageCourse/addTeacher/AddTeacher';
import { AddCourse } from '../container/manageCourse/addCourse/AddCourse';
import { VideoLesson } from '../container/lessonView/videoLesson/VideoLesson';
import { AppContext } from '../../App';
import { Subscriptions } from '../container/subscriptions/Subscriptions';
import { Payments } from '../container/payments/Payments';
import { Teacher } from '../container/teacher/Teacher';
import { Intro } from '../container/intro/Intro';
import { AddLiveLesson } from '../container/addLesson/addLiveLesson/AddLiveLesson';
import { LiveLesson } from '../container/lessonView/liveLesson/LiveLesson';
import { NotifyPayment } from '../container/notifypayment/NotifyPayment';
import { LiveLessonTeacher } from '../container/lessonView/liveLesson/LiveLessonTeacher';

type routeConfig = [string, any, string, boolean][]; // route, component, labelName, showInNavPanel

export const commonRoutes: routeConfig = [
  ['/intro/:id', Intro, 'Intro', false],
  ['/notify/:type', NotifyPayment, 'Notify', false],

  ['/teacher/:teacherId/:courseId', Course, 'Teacher', false],
  ['/teacher/:teacherId', Teacher, 'Teacher', false],

  ['/:examId/:subjectId/:courseId/live/:lessonId', LiveLesson, 'Live Lesson', false],
  ['/:examId/:subjectId/:courseId/video/:lessonId', VideoLesson, 'Video Lesson', false],

  ['/:examId/:subjectId/:courseId', Course, 'Course', false],
  ['/:examId/:subjectId', Courses, 'Courses', false],
  ['/:examId/', Subjects, 'Subjects', false],

  ['/', Exams, 'Exams', true],
];

export const teacherRoutes: routeConfig = [
  ['/addLesson', AddVideoLesson, 'Video Lessons', true],
  ['/addLive', AddLiveLesson, 'Live Lessons', true],
  ['/liveStat/:lessonId', LiveLessonTeacher, 'Check Live Attendance', false],
  ['/profile', Subscriptions, 'Profile', true],
];

export const adminRoutes: routeConfig = [
  ['/addExam', AddExam, 'Add Exam', true],
  ['/editExam', EditExam, 'Edit Exam', true],
  ['/addTeacher', AddTeacher, 'Add Teacher', true],
  ['/addSubject', AddSubject, 'Add Subject', true],
  ['/addCourse', AddCourse, 'Add Course', true],
  ['/payments', Payments, 'Payments', true],
  ['/storage', Storage, 'Storage', true],
];

const Router: React.FC = () => {
  const { isTeacher, isAdmin } = useContext(AppContext);
  return (
    <>
      <BreadcrumbBar />
      <div className={classes.container}>
        <div>
          {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
          <Switch>
            {(isTeacher) && teacherRoutes.map((r: any) => (
              <Route
                exact
                key={r[0]}
                path={r[0]}
                component={r[1]}
              />
            ))}
            {isAdmin() && adminRoutes.map((r: any) => (
              <Route
                exact
                key={r[0]}
                path={r[0]}
                component={r[1]}
              />
            ))}
            {isTeacher !== undefined && commonRoutes.map((r: any) => (
              <Route
                exact
                key={r[0]}
                path={r[0]}
                component={r[1]}
              />
            ))}
            <Route path="">
              <div className={classes.loading}>
                <p>අක්ෂර.lk</p>
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </>
  );
};

export default Router;
