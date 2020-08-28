import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import classes from './Router.module.scss';
import { Exams } from '../contents/Exams';
import { BreadcrumbBar } from '../breadcrumbs/BreadcrumbBar';
import { Subjects } from '../contents/Subjects';
import { Teacheres } from '../contents/Teachers';

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
            <Teacheres />
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
