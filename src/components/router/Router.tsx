import React, { useContext } from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import classes from './Router.module.scss';
import { Exams } from '../container/contents/Exams';
import { Subjects } from '../container/contents/Subjects';
import { Courses } from '../container/contents/Courses';
import { Course } from '../container/contents/Course';
import { BreadcrumbBar } from '../presentational/breadcrumbs/BreadcrumbBar';
import { AddLesson } from '../container/manageCourse/addLesson/AddLesson';
import { AddSubject } from '../container/manageCourse/addSubject/AddSubject';
import { EditExam } from '../container/manageCourse/editExam/EditExam';
import { AddExam } from '../container/manageCourse/addExam/AddExam';
import { AddTeacher } from '../container/manageCourse/addTeacher/AddTeacher';
import { AddCourse } from '../container/manageCourse/addCourse/AddCourse';
import { Lesson } from '../container/contents/lesson/Lesson';
import { AppContext } from '../../App';
import { UpgradeCourse } from '../container/manageCourse/upgradeCourse/UpgradeCourse';
import { Years } from '../container/contents/Years';
import { Subscriptions } from '../container/subscriptions/Subscriptions';
import { Payments } from '../container/payments/Payments';
import { Teacher } from '../container/teacher/Teacher';

type routeConfig = [string, any, string, boolean][];

export const routes: routeConfig = [
  ['/teacher/:id', Teacher, 'Teacher', false],
  ['/:examId/:year/:subjectId/:courseId/:lessonId', Lesson, 'Lesson', false],
  ['/:examId/:year/:subjectId/:courseId', Course, 'Course', false],
  ['/:examId/:year/:subjectId', Courses, 'Courses', false],
  ['/:examId/:year', Subjects, 'Subjects', false],
  ['/:examId', Years, 'Years', false],
  ['/', Exams, 'Exams', true],
];

export const teacherRoutes: routeConfig = [
  ['/addLesson', AddLesson, 'Add Lesson', true],
  ['/subscriptions', Subscriptions, 'Subscriptions', true],
  ['/upgradeCourses', UpgradeCourse, 'Upgrade Courses', true],
];

export const adminRoutes: routeConfig = [
  ['/editExam', EditExam, 'Edit Exam', true],
  ['/addExam', AddExam, 'Add Exam', true],
  ['/addTeacher', AddTeacher, 'Add Teacher', true],
  ['/addSubject', AddSubject, 'Add Subject', true],
  ['/addCourse', AddCourse, 'Subject Streams', true],
  ['/payments', Payments, 'Payments', true],
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
            {(isTeacher || isAdmin()) && teacherRoutes.map((r: any) => (
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
            {isTeacher !== undefined && routes.map((r: any) => (
              <Route
                exact
                key={r[0]}
                path={r[0]}
                component={r[1]}
              />
            ))}
            <Route path="">
              <div className={classes.loading}>
                <p>Loading</p>
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </>
  );
};

export default Router;
