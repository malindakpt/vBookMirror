/* eslint-disable jsx-a11y/media-has-caption */
import { useParams } from 'react-router-dom';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import ReactWhatsapp from 'react-whatsapp';
import classes from './VideoLesson.module.scss';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import {
  Entity, getDocWithId, updateDoc,
} from '../../../../data/Store';
import { ILesson, IVideoLesson } from '../../../../interfaces/ILesson';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { IUser } from '../../../../interfaces/IUser';
import { AppContext } from '../../../../App';
import Config from '../../../../data/Config';

export const VideoLesson: React.FC = () => {
  const { email, showSnackbar } = useContext(AppContext);
  const timerRef = useRef<any>();

  // disble context menu for avoid right click
  document.addEventListener('contextmenu', (event) => event.preventDefault());

  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [lesson, setLesson] = useState<IVideoLesson>();

  const [warn, setWarn] = useState<string>('');

  const startExpireLessonForUser = (user: IUser, lesson: ILesson) => {
    timerRef.current = setTimeout(() => {
      user.videoLessons.forEach((less, idx) => {
        if (less.id === lesson.id) {
          user.videoLessons[idx].watchedCount += 1;

          const remain = Config.allowedWatchCount - user.videoLessons[idx].watchedCount;

          const msg = remain < 1 ? 'This is the last watch time for your payment.'
            : `You can watch this lesson ${remain} more time in the future`;

          setWarn(msg);
          updateDoc(Entity.USERS, user.ownerEmail, user).then(() => {
            // showSnackbar(msg);
          });
        }
      });
    }, Config.watchedTimeout);
  };

  const processVideo = async () => {
    const lesson = await getDocWithId<IVideoLesson>(Entity.LESSONS_VIDEO, lessonId);
    if (!lesson) return;

    getDocWithId<ITeacher>(Entity.TEACHERS, lesson.ownerEmail).then((data) => data && setTeacher(data));

    if (lesson.price === 0) {
      setLesson(lesson);
      setWarn('Free Video');
    } else {
      if (email) {
        const user = await getDocWithId<IUser>(Entity.USERS, email);
        user?.videoLessons.forEach((les) => {
          if (les.id === lesson.id && les.watchedCount < Config.allowedWatchCount) {
            setWarn('Do not reload this page');
            setLesson(lesson);
            setTimeout(() => {
              // eslint-disable-next-line
              // @ts-ignore
              document.getElementById('player').src = '';
            }, 1000);

            startExpireLessonForUser(user, lesson);

            // window.onbeforeunload = () => 'You spent a remaining watch time. Are you sure to exit?';
          }
        });
      } else {
        showSnackbar('Please login with your gmail address');
      }
    }
  };

  useEffect(() => {
    processVideo();

    return () => {
      clearInterval(timerRef.current);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.warn}>
        {warn}
      </div>
      <div className={classes.topic}>
        {lesson?.topic}
      </div>
      <div className={classes.desc}>
        {lesson?.description}
      </div>
      {lesson?.videoURL && (
      <video
        width="100%"
        height="100%"
        controls
        controlsList="nodownload"
        autoPlay
      >
        <source
          id="player"
          src={lesson?.videoURL}
          // src={vidSrc}
          type="video/mp4"
        />
      </video>
      )}
      {teacher && lesson && (
      <div>
        <ReactWhatsapp
          number={teacher.phoneChat}
          message={`[${lesson?.topic}]:`}
        >
          <div>Ask Questions</div>

        </ReactWhatsapp>
      </div>
      )}
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
