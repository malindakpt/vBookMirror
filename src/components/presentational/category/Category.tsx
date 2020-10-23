import React from 'react';
import InputIcon from '@material-ui/icons/Input';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Link } from 'react-router-dom';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';
import classes from './Category.module.scss';

interface Props {
  id?: string;
  title1?: string;
  title2?: string;
  title3?: string;
  title4?: string;
  navURL: string;
  status?: 'yes' | 'no' | 'none'
  CategoryImg: OverridableComponent<SvgIconTypeMap>;
  // onSelect?: (id: string, selected: boolean) => void;
  isSelected?: boolean;
}
export const Category:React.FC<Props> = ({
  id, title1 = '', title2 = '', title3, title4, navURL, isSelected, status, CategoryImg,
}) => (
  <Link
    className={`${classes.root} ${isSelected && classes.selected}`}
    to={navURL}
    style={{ textDecoration: 'none', color: '#676767' }}
  >
    <div className={classes.image}>
      <CategoryImg
        htmlColor="#3f51b5"
        style={{ fontSize: 40 }}
      />
    </div>
    <div className={classes.content}>
      <div className={classes.title1}>{title1}</div>
      <div className={classes.iconTitle}>
        {status === 'yes' && <CheckCircleOutlineIcon htmlColor="#0aa04d" />}
        {status === 'no' && <AddCircleOutlineIcon htmlColor="red" />}
        {status === 'none' && <CheckCircleOutlineIcon htmlColor="#ffa500" />}
        {title2}
      </div>
      <div className={classes.note}>
        <span>{title3}</span>
        <span>{title4}</span>
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
