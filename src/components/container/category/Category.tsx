import React from 'react';
import ContactsIcon from '@material-ui/icons/Contacts';
import classes from './Category.module.scss';

export const Category = () => (
  <div className={classes.root}>
    <div className={classes.image}>
      <ContactsIcon style={{ fontSize: 40 }} />
    </div>
    <div className={classes.content}>
      <div>Advanced Level</div>
      <div>2022 Batch</div>
      <div>Theory/Revision</div>
    </div>
  </div>
);
