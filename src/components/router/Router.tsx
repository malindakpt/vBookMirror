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

const Router: React.FC = () => (
  <>
    <BreadcrumbBar />
    <div className={classes.container}>

      <div>
        {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
        <Switch>
          <Route
            exact
            path="/"
          >
            <Exams />
          </Route>
          <Route
            exact
            path="/manage"
          >
            <AddLesson />
          </Route>
          <Route
            exact
            path="/editExam"
          >
            <EditExam />
          </Route>

          <Route
            exact
            path="/addCourse"
          >
            <AddCourse />
          </Route>
          <Route
            exact
            path="/addTeacher"
          >
            <AddTeacher />
          </Route>
          <Route
            exact
            path="/addSubject"
          >
            <AddSubject />
          </Route>
          <Route
            exact
            path="/addExam"
          >
            <AddExam />
          </Route>
          <Route
            exact
            path="/:examId"
          >
            <Subjects />
          </Route>
          <Route
            exact
            path="/:examId/:subjectId"
          >
            <Courses />
          </Route>
          <Route
            exact
            path="/:examId/:subjectId/:courseId"
          >
            <Course />
          </Route>
          <Route path="">
            <h3>404</h3>
          </Route>
        </Switch>
      </div>

    </div>

  </>
);

export default Router;
