/* eslint-disable jsx-a11y/media-has-caption */
import { useParams } from 'react-router-dom';
import React, {
  useContext, useEffect, useState,
} from 'react';

import { Button } from '@material-ui/core';
import { AppContext } from '../../../App';
import classes from './LiveLesson.module.scss';
import Config from '../../../data/Config';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { ITeacher } from '../../../interfaces/ITeacher';
import { ILiveLesson } from '../../../interfaces/ILesson';
import { Entity, getDocWithId } from '../../../data/Store';
import { IUser } from '../../../interfaces/IUser';
import { getHashFromString, Util } from '../../../helper/util';

export const LiveLesson: React.FC = () => {
  const { email, showSnackbar } = useContext(AppContext);

  // disble context menu for avoid right click
  document.addEventListener('contextmenu', (event) => event.preventDefault());

  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [lesson, setLesson] = useState<ILiveLesson>();
  const [isFullScr, setFullScr] = useState<boolean>(false);

  const activateIframe = () => {
    setTimeout(() => {
      const ele = document.getElementsByTagName('iframe');
      if (ele && ele.length > 0 && ele[0]) {
        ele[0].contentWindow?.postMessage({ message: 'getAppData', value: 'asd' }, '*');
      }
    }, 2000);
  };

  const processVideo = async () => {
    const lesson = await getDocWithId<ILiveLesson>(Entity.LESSONS_LIVE, lessonId);
    if (!lesson) return;

    getDocWithId<ITeacher>(Entity.TEACHERS, lesson.ownerEmail).then((data) => data && setTeacher(data));

    if (lesson.price === 0) {
      setLesson(lesson);
      activateIframe();
    } else {
      if (email) {
        const user = await getDocWithId<IUser>(Entity.USERS, email);
        user?.liveLessons.forEach((les) => {
          if (les.id === lesson.id) {
            setLesson(lesson);
            activateIframe();
          }
        });
      } else {
        showSnackbar('Please login with your gmail address');
      }
    }
  };

  useEffect(() => {
    processVideo();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.topic}>
        {lesson?.topic}
      </div>
      <div className={classes.desc}>
        {lesson?.description}
      </div>
      <div>
        <Button
          className={classes.fsButton}
          onClick={() => {
            setFullScr(!isFullScr);
          }}
        >
          { isFullScr ? 'Exit' : 'Full Screen'}
        </Button>
      </div>
      {teacher && teacher.runningLessonId === lesson?.id ? (
        <iframe
          className={isFullScr ? classes.fullScr : ''}
          src={`${Config.zoomURL}?&a=${
            getHashFromString(teacher.zoomMeetingId)}&a=${
            getHashFromString(teacher.zoomPwd)}&a=${
            getHashFromString(Util.fullName)}`}
          name="iframe_a"
          height="300px"
          width="100%"
          allow="camera *;microphone *"
          title="Live Lessons"
        />
      ) : <div className={classes.notStarted}>Meeting Not Started Yet</div>}

      {lesson?.attachments && (
      <div className={classes.attachments}>
        {lesson.attachments.map((atta) => (
          <li key={atta}>
            <a
              href={atta}
              rel="noopener noreferrer"
              target="_blank"
            >
              {atta}
            </a>
          </li>
        ))}
      </div>
)}
    </div>
  );
};
