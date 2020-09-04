import React from 'react';
import ContactsIcon from '@material-ui/icons/Contacts';
import { Link } from 'react-router-dom';
import classes from './Category.module.scss';

interface Props {
    title1?: string;
    title2?: string;
    title3?: string;
    navURL: string;
}
export const Category:React.FC<Props> = ({
  title1 = '', title2 = '', title3 = '', navURL,
}) => (
  <Link
    className={classes.root}
    to={navURL}
    style={{ textDecoration: 'none', color: '#5d5d5d' }}
  >
    <div className={classes.image}>
      <ContactsIcon style={{ fontSize: 40 }} />
    </div>
    <div className={classes.content}>
      <div>{title1}</div>
      <div>{title2}</div>
      <div>{title3}</div>
    </div>
    <div className={classes.actions}>
      <ContactsIcon style={{ fontSize: 40 }} />
    </div>
  </Link>
);
