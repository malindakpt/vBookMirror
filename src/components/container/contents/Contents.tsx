import React from 'react';

import { Category } from '../category/Category';
import classes from './Contents.module.scss';

export const Contents = () => (
  <div className={classes.root}>
    <Category />
    <Category />
    <Category />
    <Category />
  </div>

);
