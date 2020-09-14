import React, { useState } from 'react';
import ContactsIcon from '@material-ui/icons/Contacts';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Link } from 'react-router-dom';
import classes from './Category.module.scss';

interface Props {
  id?: string;
  title1?: string;
  title2?: string;
  title3?: string;
  navURL: string;
  status?: 'yes' | 'no'
  onSelect?: (id: string, selected: boolean) => void;
}
export const Category:React.FC<Props> = ({
  id, title1 = '', title2 = '', title3 = '', navURL, onSelect, status,
}) => {
  const [selected, setSelected] = useState(false);
  const handleClick = () => {
    if (id && onSelect) {
      setSelected(!selected);
      onSelect(id, !selected);
    }
  };
  return (
    <Link
      className={`${classes.root} ${selected && classes.selected}`}
      to={navURL}
      style={{ textDecoration: 'none', color: '#5d5d5d' }}
      onClick={handleClick}
    >
      <div className={classes.image}>
        <ContactsIcon style={{ fontSize: 40 }} />
      </div>
      <div className={classes.content}>
        <div>{title1}</div>
        <div>{title2}</div>
        <div className={classes.iconTitle}>
          {status === 'yes' && <CheckCircleOutlineIcon htmlColor="green" />}
          {status === 'no' && <AddCircleOutlineIcon htmlColor="red" />}
          {title3}
        </div>
      </div>
      <div className={classes.actions}>
        <ContactsIcon style={{ fontSize: 40 }} />
      </div>
    </Link>
  );
};
