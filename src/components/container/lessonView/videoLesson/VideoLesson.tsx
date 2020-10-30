/* eslint-disable jsx-a11y/media-has-caption */
import { useParams } from 'react-router-dom';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import ReactWhatsapp from 'react-whatsapp';
import classes from './VideoLesson.module.scss';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import {
  Entity, getDocsWithProps, getDocWithId, updateDoc,
} from '../../../../data/Store';
import { ILesson, IVideoLesson } from '../../../../interfaces/ILesson';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { AppContext } from '../../../../App';
import Config from '../../../../data/Config';
import { IPayment } from '../../../../interfaces/IPayment';

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

  const startExpireLessonForUser = (payment: IPayment, lesson: ILesson) => {
    timerRef.current = setTimeout(() => {
      const watchedCount = payment?.watchedCount ?? 0;
      const changes = {
        watchedCount: watchedCount + 1,
        disabled: watchedCount + 1 === Config.allowedWatchCount,
      };
      updateDoc(Entity.PAYMENTS_STUDENTS, payment.id, { ...payment, ...changes }).then(() => {
        const remain = Config.allowedWatchCount - changes.watchedCount;
        const msg = remain < 1 ? 'This is the last watch time for your payment.'
          : `You can watch this lesson ${remain} more time in the future`;
        setWarn(msg);
      });
      // user.videoLessons.forEach((less, idx) => {
      //   if (less.id === lesson.id) {
      //     user.videoLessons[idx].watchedCount += 1;

      //     const remain = Config.allowedWatchCount - user.videoLessons[idx].watchedCount;

      //     const msg = remain < 1 ? 'This is the last watch time for your payment.'
      //       : `You can watch this lesson ${remain} more time in the future`;

      //     setWarn(msg);
      //     updateDoc(Entity.USERS, user.ownerEmail, user).then(() => {
      //       // showSnackbar(msg);
      //     });
      //   }
      // });
    }, Config.watchedTimeout);
  };

  const startVideoRendering = (lesson: IVideoLesson) => {
    setLesson(lesson);
    setTimeout(() => {
      // eslint-disable-next-line
      // @ts-ignore
      document.getElementById('player').src = '';
    }, 1000);
  };

  const processVideo = async () => {
    getDocWithId<IVideoLesson>(Entity.LESSONS_VIDEO, lessonId).then((lesson) => {
      if (!lesson) return;

      getDocWithId<ITeacher>(Entity.TEACHERS, lesson.ownerEmail).then((data) => data && setTeacher(data));

      if (lesson.price === 0) {
        startVideoRendering(lesson);
        setWarn('Free Video');
      } else {
        if (email) {
          getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS,
            {
              lessonId,
              ownerEmail: email,
            }).then((data) => {
            if (data && data.length > 0) {
              startVideoRendering(lesson);
              setWarn('Do not reload this page');
              startExpireLessonForUser(data[0], lesson);
            }
          });
        } else {
          showSnackbar('Please login with your gmail address');
        }
      }
    });
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
