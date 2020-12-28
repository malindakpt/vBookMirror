/* eslint-disable jsx-a11y/media-has-caption */
import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { Button } from '@material-ui/core';
import { AppContext } from '../../../../App';
import classes from './LiveLesson.module.scss';
import Config from '../../../../data/Config';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { ILiveLesson } from '../../../../interfaces/ILesson';
import { Entity, getDocsWithProps, getDocWithId } from '../../../../data/Store';
import { getHashFromString, readyToGo, Util } from '../../../../helper/util';
import { IPayment } from '../../../../interfaces/IPayment';
import { AlertDialog, AlertMode } from '../../../presentational/snackbar/AlertDialog';
import { JOIN_MODES } from '../../addLesson/addLiveLesson/AddLiveLesson';
import { Attachments } from '../../../presentational/attachments/Attachments';
import { VideoViewer } from '../../../presentational/videoViewer/VideoViewer';

export const LiveLesson: React.FC = () => {
  const { email, showSnackbar, showPaymentPopup } = useContext(AppContext);

  // disble context menu for avoid right click
  document.addEventListener('contextmenu', (event) => event.preventDefault());

  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [lesson, setLesson] = useState<ILiveLesson>();
  const [freeOrPurchased, setFreeOrPurchased] = useState<boolean>();
  const [isFullScr, setFullScr] = useState<boolean>(false);
  // TODO: revert this
  const [copyLessonWarn, setCopyLessonWarn] = useState<boolean>(false);
  const [showInView, setShowInView] = useState<boolean>(false);

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
              const status = readyToGo(data, lesson);

              if (status.ok) {
                setLesson(lesson);
                setFreeOrPurchased(true);
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
                    onCancel: () => {},
                  });
                }
                // teacher && promptPayment(email, teacher, lesson, true,
                //   () => {
                //     setTimeout(() => {
                //       window.location.reload();
                //     }, Config.realoadTimeoutAferSuccessPay);
                //   }, showSnackbar);
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
        // copyText.setSelectionRange(0, 99999);
        // document.execCommand('copy');
        // showSnackbar(`Your name '${fullName}' is copied. Paste it when login to zoom`);
      }
    }
  };

  useEffect(() => {
    processVideo();
    const glob: any = window;
    return () => {
      stopLive();
      clearInterval(glob.timer);
    };
    // eslint-disable-next-line
  }, []);

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

  const getIframe = (teacher: ITeacher) => (
    <>
      <div
        className={`${classes.fsButton} ${isFullScr ? classes.exit : ''}`}
      >
        {isFullScr ? <FullscreenExitIcon onClick={() => setFullScr(false)} />
          : <FullscreenIcon onClick={() => setFullScr(true)} />}
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
  );

  const getInViewButton = (teacher: ITeacher) => (
    showInView ? (
      <>
        {getIframe(teacher)}
        {/* <Button onClick={() => {
          setShowInView(true);
          stopLive();
        }}
        >
          DISCONNECT FROM LESSON
        </Button> */}
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
      {freeOrPurchased && lesson && (
      <div>
        <div className={classes.topic}>
          {lesson.topic}
        </div>
        <div className={classes.desc}>
          {lesson?.description}
        </div>

        { teacher && lesson.isRunning
          ? getDisplay(teacher)
          : (
            <div className={classes.notStarted}>
              {lesson.videoUrl
                ? 'Video will available only for 12 hours ' : `Meeting starts @ ${new Date(lesson.dateTime).toString().split('GMT')[0]}`}
            </div>
          )}

        <Attachments lesson={lesson} />

        <VideoViewer lesson={lesson} />
        <p>
          අක්ෂර.lk  වෙත login වී ඇති email එක මගින්ම  ඔබ Zoom වෙතද login වීම අනිවාර්ය වේ.
          නැතිනම් ඔබව ගෙවීම් නොකළ පුද්ගලයෙකු ලෙස ගුරුවරයාට පෙන්වනු ලබන අතර ඔබව විසන්ධි
          වීමද සිදුවිය හැකිය.පහත video මගින් Zoom වෙත login වන අකාරය නරඹන්න.
        </p>
        <div className={classes.tutorials}>
          <iframe
            title="Windows"
            src="https://www.youtube.com/embed/wZ9RCeyzRzE"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <iframe
            title="Android"
            src="https://www.youtube.com/embed/LgWOwoEBBcg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      ) }
      <input
        type="text"
        value=""
        onChange={() => {}}
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
