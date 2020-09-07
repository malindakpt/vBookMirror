import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import classes from './Router.module.scss';
import { Exams } from '../container/contents/Exams';
import { Subjects } from '../container/contents/Subjects';
import { Courses } from '../container/contents/Courses';
import { Course } from '../container/contents/Course';
import { BreadcrumbBar } from '../container/breadcrumbs/BreadcrumbBar';
import { AddLesson } from '../container/manageCourse/addLesson/AddLesson';
import { AddSubject } from '../container/manageCourse/addSubject/AddSubject';
import { EditExam } from '../container/manageCourse/editExam/EditExam';
import { AddExam } from '../container/manageCourse/addExam/AddExam';
import { AddTeacher } from '../container/manageCourse/addTeacher/AddTeacher';
import { AddCourse } from '../container/manageCourse/addCourse/AddCourse';
import { Lesson } from '../container/contents/lesson/Lesson';

const routes = [
  ['/', Exams],
  ['/addLesson', AddLesson],
  ['/editExam', EditExam],
  ['/addExam', AddExam],
  ['/addCourse', AddCourse],
  ['/addTeacher', AddTeacher],
  ['/addSubject', AddSubject],
  ['/:examId', Subjects],
  ['/:examId/:subjectId', Courses],
  ['/:examId/:subjectId/:courseId', Course],
  ['/:examId/:subjectId/:courseId/:lessonId', Lesson],
];

const Router: React.FC = () => (
  <>
    <BreadcrumbBar />
    <div className={classes.container}>
      <div>
        {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
        <Switch>
          {routes.map((r: any) => (
            <Route
              exact
              key={r[0]}
              path={r[0]}
              component={r[1]}
            />
          ))}
          <Route path="">
            <h3>404</h3>
          </Route>
        </Switch>
      </div>
    </div>
  </>
);

export default Router;
