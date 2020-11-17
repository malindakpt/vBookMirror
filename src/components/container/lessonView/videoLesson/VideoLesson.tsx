/* eslint-disable jsx-a11y/interactive-supports-focus */
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
import { IPayment, PaymentType } from '../../../../interfaces/IPayment';
import { AlertDialog, AlertMode } from '../../../presentational/snackbar/AlertDialog';
import { promptPayment, Util } from '../../../../helper/util';
import { CollectInfo } from '../../../presentational/snackbar/CollectInfo';
import { InteractionType } from '../../../../interfaces/IStudentUpdate';

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
  };

  const onAcceptAlert = () => {
    if (email && tempLesson && teacher) {
      startVideoRendering(tempLesson);
      setWarn('Do not reload this page');
      startExpireLessonForUser();
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

              if (validPayment) {
                setAlert(true);
                setPayment(validPayment);
                setTempLesson(lesson);
              } else if (amIOwnerOfLesson(lesson)) {
                setWarn('Watch as owner');
                startVideoRendering(lesson);
              } else {
                setWarn('මුදල් ගෙවියයුතු පාඩමකි.  ඔබ දැනටමත්  මුදල් ගෙවා ඇත්නම්  මිනිත්තු 2 කින් පමණ නැවත උත්සහ කරන්න.\n This is a paid lesson. Please try again in 2 miniutes if you have paid already');
                promptPayment(email, teacher, lesson, PaymentType.VIDEO_LESSON, () => {
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
    processVideo();
    // if (email) {
    //   processVideo();
    // } else {
    //   // Util.invokeLogin();
    //   // showSnackbar('Please login with your gmail address and reload the page');
    // }

    return () => {
      clearInterval(timerRef.current);
    };
    // eslint-disable-next-line
  }, [email]);

  const [isFull, setFull] = useState<boolean>(false);

  return (
    <div className={`${classes.root} ${!isFull && classes.maxWidth}`}>
      {lesson && (
      <CollectInfo
        reference={lesson.id}
        lessonType={InteractionType.VIDEO_LESSON}
      />
      )}
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
        <div className={isFull ? classes.full : classes.small}>
          <div
            className={classes.playerHead}
            role="button"
            onKeyDown={() => {}}
            onClick={(e) => {
              setFull((prev) => !prev);
              e.stopPropagation();
            }}
          >
            .
          </div>
          <iframe
            className={classes.player}
            title="video"
            src={lesson?.videoURL}
          />
        </div>
      )}
      <div
        className={classes.lessonInfo}
        style={isFull ? { display: 'none' } : {}}
      >
        {teacher && lesson && (
        <div>
          <div>
            <a
              href={`tel:${teacher.phoneChat}`}
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Call Teacher:
              {teacher.phoneChat}
            </a>
          </div>
          <ReactWhatsapp
            number={teacher.phoneChat}
            message={`[${lesson?.topic}]:`}
          >
            <div>WhatsApp Chat</div>
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
      </div>
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
