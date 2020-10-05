/* eslint-disable jsx-a11y/media-has-caption */
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import classes from './Lesson.module.scss';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { getDocWithId, getVideo } from '../../../../data/Store';
import { ILesson } from '../../../../interfaces/ILesson';

export const Lesson: React.FC = () => {
  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [lesson, setLesson] = useState<ILesson>();
  const [vidSrc, setVidSrc] = useState<string | null>(null);

  const processVideo = async () => {
    const lesson = await getDocWithId<ILesson>('lessons', lessonId);

    if (lesson) {
      const url = await getVideo(lesson.email, lesson.videoId);
      setLesson(lesson);
      setVidSrc(url);
    }
  };

  useEffect(() => {
    processVideo();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.desc}>
        {lesson?.description}
      </div>
      {vidSrc && (
      <video
        width="100%"
        height="100%"
        controls
        controlsList="nodownload"
      >
        <source
          src={vidSrc}
          type="video/mp4"
        />
      </video>
      )}
    </div>
  );
};
