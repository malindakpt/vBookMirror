import React from 'react';
import { isMobile } from '../../../helper/util';
import { ITeacher } from '../../../interfaces/ITeacher';
import classes from './Banner.module.scss';

interface Props{
    teacher: ITeacher;
}
export const Banner: React.FC<Props> = ({ teacher }) => {
  const image = isMobile() ? teacher.bannerUrl1 : teacher.bannerUrl2;

  if (!image || image.length < 2) return <></>;

  return (
    <div className={classes.addView}>
      <img
        alt="banner"
        src={image}
      />
    </div>
  );
};
