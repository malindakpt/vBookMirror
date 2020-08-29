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
import { ManageCourse } from '../container/manageCourse/ManageCourse';

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
            <ManageCourse />
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
        </Switch>
      </div>

    </div>

  </>
);

export default Router;
