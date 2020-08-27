import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import classes from './Router.module.scss';
import { Contents } from '../contents/Contents';
import { BreadcrumbBar } from '../breadcrumbs/BreadcrumbBar';

const Router: React.FC = () => (
  <>
    <BreadcrumbBar />
    <div className={classes.container}>

      <div>
        {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/contents">
            <Contents />
          </Route>
          <Route path="/users">
            <div>Users</div>
          </Route>
          <Route path="/">
            <Contents />
          </Route>
        </Switch>
      </div>

    </div>

  </>
);

export default Router;
