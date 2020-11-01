/* eslint-disable jsx-a11y/media-has-caption */
import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../../App';
import classes from './LiveLesson.module.scss';
import Config from '../../../../data/Config';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { ILiveLesson } from '../../../../interfaces/ILesson';
import { Entity, getDocsWithProps, getDocWithId } from '../../../../data/Store';
import { getHashFromString, Util } from '../../../../helper/util';
import { IPayment } from '../../../../interfaces/IPayment';
import logo from '../../../../images/logo.png';

export const LiveLessonTeacher: React.FC = () => {
  const { email, showSnackbar } = useContext(AppContext);

  // disable context menu for avoid right click
  document.addEventListener('contextmenu', (event) => event.preventDefault());

  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [lesson, setLesson] = useState<ILiveLesson>();
  const [showInView, setShowInView] = useState<boolean>(false);
  const [userNames, setUserNames] = useState<{userName: string}[]>([]);
  const [paymentForLesson, setPaymentsForLesson] = useState<IPayment[]>([]);

  const sendStartAction = () => {
    const ele = document.getElementsByTagName('iframe');
    if (ele && ele.length > 0 && ele[0]) {
      ele[0].contentWindow?.postMessage({ type: 'START', value: '' }, '*');
    }
  };

  const stopLive = () => {
    const ele = document.getElementsByTagName('iframe');
    if (ele && ele.length > 0 && ele[0]) {
      ele[0].contentWindow?.postMessage({ type: 'STOP', value: '' }, '*');
    }
  };

  const startVideoRendering = () => {
    sendStartAction();
    window.addEventListener('message', (e) => {
      const atts = e.data;
      if (atts.type === 'CONNECT') {
        const mems = atts?.data?.result?.attendeesList;
        if (mems) {
          setUserNames(mems);
        }
      } else if (atts.type === 'JOIN') {
        setUserNames((prev) => {
          const clone = [...prev, atts.data];
          return clone;
        });
        // eslint-disable-next-line no-new
        new Notification('Invalid user detected', { body: atts.data.userName, icon: logo });
      } else if (atts.type === 'LEAVE') {
        setUserNames((prev) => {
          const clone = [...prev, atts.data];
          return clone;
        });
      }
    }, false);

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

      getDocWithId<ITeacher>(Entity.TEACHERS, lesson.ownerEmail).then((teacher) => {
        teacher && setTeacher(teacher);

        if (email) {
          getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS,
            { lessonId }).then((data) => {
            setLesson(lesson);
            setPaymentsForLesson(data);
            startVideoRendering();
          });
        } else {
          showSnackbar('Please login with your gmail address');
        }
      });
    });
  };

  useEffect(() => {
    Notification.requestPermission().then((result) => {
      console.log(result);
    });
    processVideo();
    const glob: any = window;
    return () => {
      stopLive();
      clearInterval(glob.timer);
    };
    // eslint-disable-next-line
  }, []);

  const getIframe = (teacher: ITeacher) => (
    <>
      <iframe
        src={`${Config.zoomURL}?&a=${getHashFromString(teacher.zoomMeetingId)}&a=${
          getHashFromString(teacher.zoomPwd)}&a=${getHashFromString(Util.fullName)}`}
        name="iframe_a"
        height="300px"
        width="100%"
        allow="camera *;microphone *"
        title="Live Lessons"
      />
    </>
  );

  return (
    <div className={classes.root}>
      { lesson && (
      <div>
        <div className={classes.topic}>
          {lesson.topic}
        </div>
        <div className={classes.desc}>
          {lesson?.description}
        </div>
        <div className={classes.check}>
          <table>
            {userNames.map((user) => <tr>{user.userName}</tr>)}
          </table>
        </div>
        {teacher && teacher.zoomRunningLessonId === lesson.id
          ? getIframe(teacher)
          : <div className={classes.notStarted}>Meeting Not Started Yet</div>}

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
    </div>
  );
};
