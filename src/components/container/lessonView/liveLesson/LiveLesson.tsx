import { useParams } from 'react-router-dom';
import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { Button } from '@material-ui/core';
import { AppContext } from '../../../../App';
import classes from './LiveLesson.module.scss';
import Config from '../../../../data/Config';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { ILiveLesson } from '../../../../interfaces/ILesson';
import {
  addOrUpdate,
  Entity, getDocsWithProps, getDocWithId,
} from '../../../../data/Store';
import {
  getHashFromString, isLessonOwner, readyToGo, Util,
} from '../../../../helper/util';
import { IPayment } from '../../../../interfaces/IPayment';
import { AlertDialog, AlertMode } from '../../../presentational/snackbar/AlertDialog';
import { JOIN_MODES } from '../../addLesson/addLiveLesson/AddLiveLesson';
import { Attachments } from '../../../presentational/attachments/Attachments';
import { VideoViewer } from '../../../presentational/videoViewer/VideoViewer';
import { PaymentManger } from '../../../presentational/paymentManager/PaymentManager';
import { Recorder } from '../../../presentational/recorder/Recorder';
import { IAttendance } from '../../../../interfaces/IAttendance';
import { addToStorage, getFromStorage, LocalStorageKeys } from '../../../../data/LocalStorage';

export const LiveLesson: React.FC = () => {
  const { email, showSnackbar, showPaymentPopup } = useContext(AppContext);

  // disble context menu for avoid right click

  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [lesson, setLesson] = useState<ILiveLesson>();
  const [freeOrPurchased, setFreeOrPurchased] = useState<boolean>();
  const [isFullScr, setFullScr] = useState<boolean>(false);
  // TODO: revert this
  const [copyLessonWarn, setCopyLessonWarn] = useState<boolean>(false);
  const [showInView, setShowInView] = useState<boolean>(false);
  const [warn, setWarn] = useState<string>('');

  const livePingTimer = useRef<any>();
  const sendStartTimer = useRef<any>();

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

    if (sendStartTimer.current) {
      clearInterval(sendStartTimer.current);
    }

    sendStartTimer.current = setInterval(() => {
      console.log('send start mkpt');
      sendStartAction();
    }, 1000);

    setTimeout(() => {
      clearInterval(sendStartTimer.current);
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
            getDocsWithProps<IPayment>(Entity.PAYMENTS_STUDENTS,
              { lessonId, ownerEmail: email }).then((data) => {
                // TODO:  Check refundable lessons here
                const status = readyToGo(data, lesson);

                if (status.ok) {
                  setLesson(lesson);
                  setFreeOrPurchased(true);
                } else if (isLessonOwner(email, lesson)) {
                  setLesson(lesson);
                  setFreeOrPurchased(true);
                  setWarn('Watch as owner');
                } else {
                  if (teacher) {
                    showPaymentPopup({
                      email,
                      paidFor: teacher.ownerEmail,
                      lesson,
                      teacher,
                      onSuccess: () => {
                        setTimeout(() => {
                          window.location.reload();
                        }, Config.realoadTimeoutAferSuccessPay);
                      },
                      onCancel: () => { },
                    });
                  }
                }
              });
          } else {
            showSnackbar('Please login with your Gmail address');
            Util.invokeLogin();
          }
        } else {
          setLesson(lesson);
          setFreeOrPurchased(true);
        }
      });
    });
  };

  const copyName = () => {
    if (email) {
      const { fullName } = Util;
      const copyText: any = document.getElementById('copyInput');

      if (copyText) {
        copyText.value = fullName;
        copyText.select();
      }
    }
  };

  const sendLiveAttendancePing = useCallback(() => {
    let initialLoggedTime = getFromStorage(LocalStorageKeys.INITIAL_LOGGED_TIME);
    if (!initialLoggedTime) {
      initialLoggedTime = new Date().getTime();
      addToStorage(LocalStorageKeys.INITIAL_LOGGED_TIME, initialLoggedTime);
    }

    const uid = `${email}-${initialLoggedTime}`;

    if (lessonId && uid) {
      const attendance: IAttendance = {
        id: lessonId,
        students: {
          [uid]: {
            id: uid,
            ownerEmail: email ?? 'Not logged in',
            timestamp: new Date().getTime(),
          },
        },

      };
      addOrUpdate<IAttendance>(Entity.ATTENDANCE, lessonId, attendance).then(() => {
        console.log('Attendance sent');
      });
    }
  }, [email, lessonId]);

  const getAppButton = (teacher: ITeacher) => (
    <Button
      onClick={() => {
        setCopyLessonWarn(true);
        copyName();
      }}
    >
      OPEN LESSON WITH ZOOM
    </Button>
  );

  const getIframe = (teacher: ITeacher, lesson: ILiveLesson) => {
    let zoomLink = `${Config.zoomURL}?&a=${getHashFromString(
      teacher.zoomMeetingId)}&a=${getHashFromString(teacher.zoomPwd)}&a=${getHashFromString(Util.fullName)}`;

    if ((lesson.assistantZoomMeetingId && lesson.assistantZoomMeetingId.length > 3)
      && (lesson.assistantZoomPwd && lesson.assistantZoomPwd.length > 3)) {
      zoomLink = `${Config.zoomURL}?&a=${getHashFromString(teacher.zoomMeetingId)
        }&a=${getHashFromString(teacher.zoomPwd)}&a=${getHashFromString(Util.fullName)}`;
    }

    return (<>
      <div
        className={`${classes.fsButton} ${isFullScr ? classes.exit : ''}`}
      >
        {isFullScr ? <FullscreenExitIcon onClick={() => setFullScr(false)} />
          : <FullscreenIcon onClick={() => setFullScr(true)} />}
      </div>
      <iframe
        className={isFullScr ? classes.fullScr : ''}
        src={zoomLink}
        name="iframe_a"
        height="300px"
        width="100%"
        allow="camera *;microphone *"
        title="Live Lessons"
      />
    </>);
  };

  useEffect(() => {
    processVideo();

    if (sendStartTimer.current) {
      clearInterval(sendStartTimer.current);
    }
    if (livePingTimer.current) {
      clearInterval(livePingTimer.current);
    }
    livePingTimer.current = setInterval(sendLiveAttendancePing, Config.liveAttendanceSendInterval);

    return () => {
      stopLive();
      clearInterval(sendStartTimer.current);
      clearInterval(livePingTimer.current);
    };
    // eslint-disable-next-line
  }, []);

  const getInViewButton = (teacher: ITeacher) => (
    showInView ? (
      <>
        {lesson && getIframe(teacher, lesson)}
      </>
    ) : (
      <>
        <Button onClick={() => {
          setShowInView(true);
          startVideoRendering();
        }}
        >
          CONNECT FROM WEB
        </Button>
      </>

    )
  );

  const getDisplay = (teacher: ITeacher) => {
    switch (teacher.zoomJoinMode) {
      case JOIN_MODES.ONLY_AKSHARA:
        return getInViewButton(teacher);
      case JOIN_MODES.AKSHARA_AND_APP:
        return (
          <>
            {/* {getInViewButton(teacher)} */}
            {getAppButton(teacher)}
          </>
        );
      case JOIN_MODES.ONLY_APP:
        return getAppButton(teacher);
      default:
        return getAppButton(teacher);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.warn}>
        {warn}
      </div>
      {email && lessonId && (
        <Recorder
          email={email}
          lessonId={lessonId}
        />
      )}
      <PaymentManger lesson={lesson} />
      {freeOrPurchased && lesson && (
        <div>
          <div className={classes.topic}>
            {lesson.topic}
          </div>
          <div className={classes.desc}>
            {lesson?.description}
          </div>

          {teacher && lesson.isRunning
            ? getDisplay(teacher)
            : (
              <div className={classes.notStarted}>
                {lesson.videoUrl
                  ? 'Video will available only for 12 hours ' : `Live Meeting 
                starts @ ${new Date(lesson.dateTime).toString().split('GMT')[0]}`}
              </div>
            )}

          <Attachments lesson={lesson} />
          <br />
          <VideoViewer lesson={lesson} />
        </div>
      )}
      <input
        type="text"
        value=""
        onChange={() => { }}
        id="copyInput"
        style={{ width: '1px', position: 'fixed', left: '-100px' }}
      />
      {copyLessonWarn && (
        <AlertDialog
          type={AlertMode.COPY_NAME}
          onAccept={() => {
            setCopyLessonWarn(false);
            window.open(`https://us04web.zoom.us/j/${teacher?.zoomMeetingId}?pwd=${teacher?.zoomPwd}`,
              '_blank');
          }}
          onCancel={() => {
            setCopyLessonWarn(false);
          }}
        />
      )}
    </div>
  );
};
