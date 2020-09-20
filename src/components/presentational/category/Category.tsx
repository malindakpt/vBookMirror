import React, { useState } from 'react';
import InputIcon from '@material-ui/icons/Input';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ForwardIcon from '@material-ui/icons/Forward';
import { Link } from 'react-router-dom';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';
import classes from './Category.module.scss';

interface Props {
  id?: string;
  title1?: string;
  title2?: string;
  title3?: string;
  navURL: string;
  status?: 'yes' | 'no'
  CategoryImg: OverridableComponent<SvgIconTypeMap>;
  onSelect?: (id: string, selected: boolean) => void;
}
export const Category:React.FC<Props> = ({
  id, title1 = '', title2 = '', title3 = '', navURL, onSelect, status, CategoryImg,
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
        <CategoryImg
          htmlColor="#3f51b5"
          style={{ fontSize: 40 }}
        />
      </div>
      <div className={classes.content}>
        <div>{title1}</div>
        <div>{title2}</div>
        <div className={classes.iconTitle}>
          <div>
            {status === 'yes' && <CheckCircleOutlineIcon htmlColor="#0aa04d" />}
            {status === 'no' && <AddCircleOutlineIcon htmlColor="red" />}
          </div>
          {title3}
        </div>
      </div>
      <div className={classes.actions}>
        <InputIcon
          htmlColor="#3f51b5"
          style={{ fontSize: 40 }}
        />
      </div>
    </Link>
  );
};
