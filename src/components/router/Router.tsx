import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import classes from './Router.module.scss';
import { Exams } from '../container/contents/Exams';
import { BreadcrumbBar } from '../container/breadcrumbs/BreadcrumbBar';
import { Subjects } from '../container/contents/Subjects';
import { Courses } from '../container/contents/Courses';
import { Course } from '../presentational/course/Course';

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
            path="/exams"
          >
            <Exams />
          </Route>
          <Route
            exact
            path="/exams/:examId/subjects"
          >
            <Subjects />
          </Route>
          <Route
            exact
            path="/exams/:examId/subjects/:subjectId"
          >
            <Courses />
          </Route>
          <Route
            exact
            path="/exams/:examId/subjects/:subjectId/:courseId"
          >
            <Course />
          </Route>
          <Route path="/">
            <h4>Not Found</h4>

          </Route>
        </Switch>
      </div>

    </div>

  </>
);

export default Router;
