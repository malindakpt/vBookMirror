import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import loader from '../../images/loading/a.gif';
import classes from './Router.module.scss';
import { Exams } from '../container/exams/Exams';
import { Subjects } from '../container/subjects/Subjects';
import { Courses } from '../container/courses/Courses';
import { Course } from '../container/course/Course';
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
import { AddPaperLesson } from '../container/addLesson/addPaperLesson/AddPaperLesson';
import { PaperLesson } from '../container/lessonView/paperLesson/PaperLesson';
import { PaymentRequests } from '../container/paymentRequests/PaymentRequests';

type routeConfig = [string, any, string, boolean][]; // route, component, labelName, showInNavPanel

export const commonRoutes: routeConfig = [
  ['/intro/:id', Intro, 'Intro', false],
  ['/notify/:type', NotifyPayment, 'Notify', false],

  ['/teacher/:teacherId/:courseId/live/:lessonId', LiveLesson, 'Live Lesson', false],
  ['/teacher/:teacherId/:courseId/video/:lessonId', VideoLesson, 'Video Lesson', false],
  ['/teacher/:teacherId/:courseId/paper/:lessonId', PaperLesson, 'Paper Lesson', false],
  ['/teacher/:teacherId/:courseId', Course, 'Teacher', false],
  ['/teacher/:teacherId', Teacher, 'Teacher', false],

  ['/:examId/:subjectId/:courseId/live/:lessonId', LiveLesson, 'Live Lesson', false],
  ['/:examId/:subjectId/:courseId/video/:lessonId', VideoLesson, 'Video Lesson', false],
  ['/:examId/:subjectId/:courseId/paper/:lessonId', PaperLesson, 'Paper Lesson', false],

  ['/:examId/:subjectId/:courseId', Course, 'Course', false],
  ['/:examId/:subjectId', Courses, 'Courses', false],
  ['/:examId/', Subjects, 'Subjects', false],

  ['/', Exams, 'Exams', false],
];

export const teacherRoutes: routeConfig = [
  ['/addLesson', AddVideoLesson, 'Video', true],
  ['/addLive', AddLiveLesson, 'Live', true],
  ['/addPaper', AddPaperLesson, 'Paper', true],
  ['/liveStat/:lessonId', LiveLessonTeacher, 'Check Live Attendance', false],
  ['/paymentRequests', PaymentRequests, 'Requests', true],
  ['/profile', Subscriptions, 'Profile', true],
];

export const adminRoutes: routeConfig = [
  ['/addExam', AddExam, 'Add Exam', true],
  ['/editExam', EditExam, 'Edit Exam', true],
  ['/addTeacher', AddTeacher, 'Add Teacher', true],
  ['/addSubject', AddSubject, 'Add Subject', true],
  ['/addCourse', AddCourse, 'Add Course', true],
  ['/payments', Payments, 'Payments', true],
];

const Router: React.FC = () => {
  document.addEventListener('contextmenu', (event) => event.preventDefault());
  const { isTeacher, isAdmin, isLoading } = useContext(AppContext);

  return (
    <>
      {isLoading && (
      <div className={classes.loader}>
        <img
          alt="loading"
          src={loader}
        />
      </div>
      )}
      <div
        className={classes.help}
        id="payGuide"
      >
        <a
          href="https://youtu.be/9gDP0N5Gh_Q"
          target="_blank"
          rel="noopener noreferrer"
        >
          බැංකු කාඩ් මගින් මුදල් ගෙවන ආකාරය
        </a>
        <br />
        <a
          href="https://youtu.be/uSjUzmhE1NQ"
          target="_blank"
          rel="noopener noreferrer"
          style={{ lineHeight: '30px', marginLeft: '10px' }}
        >
          EzCash මගින් මුදල් ගෙවන ආකාරය
        </a>
        <br />
        <a
          href="tel:0771141194"
          style={{ fontSize: '11px', textAlign: 'center', margin: '5px' }}
        >
          Call for help: 0771141194
        </a>
      </div>

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
                <p />
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </>
  );
};

export default Router;
