/* eslint-disable jsx-a11y/media-has-caption */
import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { AppContext } from '../../../../App';
import classes from './LiveLesson.module.scss';
import Config from '../../../../data/Config';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { ILiveLesson } from '../../../../interfaces/ILesson';
import { Entity, getDocsWithProps, getDocWithId } from '../../../../data/Store';
import { getHashFromString, promptPayment, Util } from '../../../../helper/util';
import { IPayment } from '../../../../interfaces/IPayment';
import { AlertDialog, AlertMode } from '../../../presentational/snackbar/AlertDialog';

export const LiveLesson: React.FC = () => {
  const { email, showSnackbar } = useContext(AppContext);

  // disble context menu for avoid right click
  document.addEventListener('contextmenu', (event) => event.preventDefault());

  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [lesson, setLesson] = useState<ILiveLesson>();
  const [freeOrPurchased, setFreeOrPurchased] = useState<boolean>();
  const [isFullScr, setFullScr] = useState<boolean>(false);
  const [micWarn, setMicWarn] = useState<boolean>(true);

  const sendStartAction = () => {
    const ele = document.getElementsByTagName('iframe');
    if (ele && ele.length > 0 && ele[0]) {
      ele[0].contentWindow?.postMessage({ message: 'getAppData', value: 'asd' }, '*');
    }
  };

  const startVideoRendering = (lesson: ILiveLesson) => {
    setLesson(lesson);
    setFreeOrPurchased(true);
    sendStartAction();

    const glob: any = window;

    glob.timer = setInterval(() => {
      console.log('send start mkpt');
      sendStartAction();
    }, 1000);

    setTimeout(() => {
      clearInterval(glob.timer);
    }, 30000);
  };

  const processVideo = async () => {
    getDocWithId<ILiveLesson>(Entity.LESSONS_LIVE, lessonId).then((lesson) => {
      if (!lesson) return;

      // Fetch techer for show teache info and check is this running lesson ID
      getDocWithId<ITeacher>(Entity.TEACHERS, lesson.ownerEmail).then((teacher) => {
        teacher && setTeacher(teacher);

        if (lesson.price) {
          if (email) {
            getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS,
              { lessonId, ownerEmail: email }).then((data) => {
            // TODO:  Check refundable lessons here
              if (data && data.length > 0) {
                startVideoRendering(lesson);
              } else {
                teacher && promptPayment(email, teacher, lesson, true,
                  () => {
                    setTimeout(() => {
                      window.location.reload();
                    }, Config.realoadTimeoutAferSuccessPay);
                  }, showSnackbar);
              }
            });
          } else {
            showSnackbar('Please login with your gmail address');
          }
        } else {
          startVideoRendering(lesson);
        }
      });
    });
  };

  useEffect(() => {
    processVideo();
    const glob: any = window;
    return () => {
      clearInterval(glob.timer);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      {freeOrPurchased && lesson && (
      <div>
        <div className={classes.topic}>
          {lesson.topic}
        </div>
        <div className={classes.desc}>
          {lesson?.description}
        </div>
        {teacher && teacher.zoomRunningLessonId === lesson.id ? (
          <>
            <div
              className={`${classes.fsButton} ${isFullScr ? classes.exit : ''}`}
            >
              {isFullScr ? <FullscreenExitIcon onClick={() => setFullScr(false)} /> : <FullscreenIcon onClick={() => setFullScr(true)} />}
            </div>
            <iframe
              className={isFullScr ? classes.fullScr : ''}
              src={`${Config.zoomURL}?&a=${getHashFromString(teacher.zoomMeetingId)}&a=${
                getHashFromString(teacher.zoomPwd)}&a=${getHashFromString(Util.fullName)}`}
              name="iframe_a"
              height="300px"
              width="100%"
              allow="camera *;microphone *"
              title="Live Lessons"
            />
          </>
        ) : <div className={classes.notStarted}>Meeting Not Started Yet</div>}

        {lesson.attachments && (
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
      ) }
      {micWarn && (
      <AlertDialog
        type={AlertMode.LIVE}
        onAccept={() => {
          setMicWarn(false);
        }}

        onCancel={() => {
          // setAccepted(false);
          // setDisplayAlert(AlertMode.NONE);
        }}
      />
      )}
    </div>
  );
};
