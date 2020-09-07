import React, { useState } from 'react';
import ContactsIcon from '@material-ui/icons/Contacts';
import { Link } from 'react-router-dom';
import classes from './Category.module.scss';

interface Props {
  id?: string;
  title1?: string;
  title2?: string;
  title3?: string;
  navURL: string;
  onSelect?: (id: string, selected: boolean) => void;
}
export const Category:React.FC<Props> = ({
  id, title1 = '', title2 = '', title3 = '', navURL, onSelect,
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
        <div>{title3}</div>
      </div>
      <div className={classes.actions}>
        <ContactsIcon style={{ fontSize: 40 }} />
      </div>
    </Link>
  );
};
