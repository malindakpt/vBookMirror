/* eslint-disable jsx-a11y/media-has-caption */
import { useHistory, useParams } from 'react-router-dom';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import ReactWhatsapp from 'react-whatsapp';
import classes from './VideoLesson.module.scss';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import {
  Entity, getDocsWithProps, getDocWithId, updateDoc,
} from '../../../../data/Store';
import { IVideoLesson } from '../../../../interfaces/ILesson';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { AppContext } from '../../../../App';
import Config from '../../../../data/Config';
import { IPayment } from '../../../../interfaces/IPayment';
import { AlertDialog, AlertMode } from '../../../presentational/snackbar/AlertDialog';
import { promptPayment, Util } from '../../../../helper/util';

export const VideoLesson: React.FC = () => {
  const history = useHistory();
  const { email, showSnackbar } = useContext(AppContext);
  const timerRef = useRef<any>();

  // disble context menu for avoid right click
  document.addEventListener('contextmenu', (event) => event.preventDefault());

  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [teacher, setTeacher] = useState<ITeacher | null>(null);

  const [tempLesson, setTempLesson] = useState<IVideoLesson>();
  const [lesson, setLesson] = useState<IVideoLesson>();

  const [warn, setWarn] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);
  const [payment, setPayment] = useState<IPayment>();

  const startExpireLessonForUser = () => {
    const pay = payment;
    // If owner is watching the video no need to update
    if (pay) {
      timerRef.current = setTimeout(() => {
        const watchedCount = pay?.watchedCount ?? 0;
        const changes = {
          watchedCount: watchedCount + 1,
          disabled: watchedCount + 1 === Config.allowedWatchCount,
        };
        updateDoc(Entity.PAYMENTS_STUDENTS, pay.id, { ...pay, ...changes }).then(() => {
          const remain = Config.allowedWatchCount - changes.watchedCount;
          const msg = remain < 1 ? 'This is the last watch time for your payment.'
            : `You can watch this lesson ${remain} more times in the future`;
          setWarn(msg);
        });
      }, Config.watchedTimeout);
    }
  };

  const amIOwnerOfLesson = (lesson: IVideoLesson) => email === lesson.ownerEmail;

  const startVideoRendering = (lesson: IVideoLesson) => {
    setLesson(lesson);
    setTimeout(() => {
      // eslint-disable-next-line
      // @ts-ignore
      document.getElementById('player').src = '';
    }, 1000);
  };

  const onAcceptAlert = () => {
    if (email && tempLesson && teacher) {
    //   getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS,
    //     {
    //       lessonId,
    //       ownerEmail: email,
    //     }).then((data) => {
    //     if (data && data.length > 0) {
    //       const validPayment = data.find((pay) => (!pay.disabled && (pay.watchedCount || 0)
    //        < Config.allowedWatchCount));
    //       if (validPayment || amIOwnerOfLesson(tempLesson)) {
      startVideoRendering(tempLesson);
      setWarn('Do not reload this page');
      startExpireLessonForUser();
      //     if (validPayment) {
      //       startExpireLessonForUser(validPayment);
      //     }
      //   } else {
      //     promptPayment(email, teacher, tempLesson, false, () => {
      //       setTimeout(() => {
      //         window.location.reload();
      //       }, Config.realoadTimeoutAferSuccessPay);
      //     }, showSnackbar);
      //   }
      // }
      // });
    } else {
      showSnackbar('Please login with your gmail address');
    }
  };

  const processVideo = async () => {
    getDocWithId<IVideoLesson>(Entity.LESSONS_VIDEO, lessonId).then((lesson) => {
      if (!lesson) return;

      getDocWithId<ITeacher>(Entity.TEACHERS, lesson.ownerEmail).then((teacher) => {
        if (!teacher) return;

        setTeacher(teacher);
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
              // If payments found
              // if (data?.length > 0) {
              const validPayment = data.find((pay) => (!pay.disabled && (pay.watchedCount || 0)
                  < Config.allowedWatchCount));

              if (validPayment || amIOwnerOfLesson(lesson)) {
                setAlert(true);
                setPayment(validPayment);
                setTempLesson(lesson);
              } else {
                promptPayment(email, teacher, lesson, false, () => {
                  // DO not reload this page since it can cause to reset your watch count
                }, showSnackbar);
              }
              // }
            });
          } else {
            Util.invokeLogin();
            showSnackbar('Please login with your gmail address and reload the page');
          }
        }
      });
    });
  };

  useEffect(() => {
    if (email) {
      processVideo();
    } else {
      Util.invokeLogin();
      showSnackbar('Please login with your gmail address and reload the page');
    }

    return () => {
      clearInterval(timerRef.current);
    };
    // eslint-disable-next-line
  }, [email]);

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
        {lesson.attachments.map((atta, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={atta + idx}>
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

      {alert && payment && (
      <AlertDialog
        type={AlertMode.VIDEO}
        onAccept={() => {
          setAlert(false);
          onAcceptAlert();
        }}

        onCancel={() => {
          setAlert(false);
          history.goBack();
        }}
      />
      )}
    </div>
  );
};
