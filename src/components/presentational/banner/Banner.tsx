import React from 'react';
import { SAMPLE_DESKTOP_COVER, SAMPLE_MOBILE_COVER } from '../../../data/Config';
import { isMobile } from '../../../helper/util';
import { ITeacher } from '../../../interfaces/ITeacher';
import classes from './Banner.module.scss';

interface Props{
    teacher: ITeacher;
}
export const Banner: React.FC<Props> = ({ teacher }) => {
  let image = isMobile() ? teacher.bannerUrl1 : teacher.bannerUrl2;

  if (!image || image.length < 2) {
    image = isMobile() ? SAMPLE_MOBILE_COVER : SAMPLE_DESKTOP_COVER;
  }

  return (
    <div className={classes.addView}>
      <img
        alt="banner"
        src={image}
      />
    </div>
  );
};
