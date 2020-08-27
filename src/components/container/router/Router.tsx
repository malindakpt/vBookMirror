import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import classes from './Router.module.scss';

const Router: React.FC = () => (
  <div className={classes.container}>

    <div>
      {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/about">
          <div>About Page</div>
        </Route>
        <Route path="/users">
          <div>Users</div>
        </Route>
        <Route path="/">
          <div>Home</div>
        </Route>
      </Switch>
    </div>

  </div>
);

export default Router;
