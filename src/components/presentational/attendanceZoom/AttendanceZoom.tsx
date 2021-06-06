/* eslint-disable jsx-a11y/media-has-caption */
import { useParams } from 'react-router-dom';
import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import { Button } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classes from './AttendanceZoom.module.scss';
import Config from '../../../data/Config';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { ITeacher } from '../../../interfaces/ITeacher';
import { ILesson, ILiveLesson } from '../../../interfaces/ILesson';
import { Entity, getDocsWithProps, getDocWithId } from '../../../data/Store';
import { getHashFromString, Util } from '../../../helper/util';
import { IPayment } from '../../../interfaces/IPayment';
import logo from '../../../images/logo.png';
import { AppContext } from '../../../App';

interface ZoomUser{
  userName: string;
  userId: string;
  isHost: boolean;
}

interface StudentConnection {
  [key: string]: {
    // email: string;
    name: string;
    count: number;
  }
}

const REPEAT_START_TIMES = 21;
export const AttendaceZoom: React.FC = () => {
  const { email, showSnackbar } = useContext(AppContext);

  // disable context menu for avoid right click
  document.addEventListener('contextmenu', (event) => event.preventDefault());

  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [teacher, setTeacher] = useState<ITeacher | null>(null);

  const [lesson, setLesson] = useState<ILiveLesson>();
  const selectedLesson = useRef<ILesson>();
  const paymentsForSelectedLesson = useRef<IPayment[]>();

  const [userNames, setUserNames] = useState<ZoomUser[]>([]);
  const [paymentForLesson, setPaymentsForLesson] = useState<IPayment[]>([]);
  const [nonPaid, setNonPaid] = useState<ZoomUser[]>([]);

  const [users, setUsers] = useState< StudentConnection >({});
  const [connected, setConnected] = useState<boolean>(false);
  const [zoomStarted, setZoomStarted] = useState<boolean>(false);
  const [disconnected, setDisconnected] = useState<boolean>(false);
  const [sentStartCommands, setSentStartCommands] = useState<number>(0);

  const startConnectTimerRef = useRef<any>();
  const memeberCount = useRef<number>(0);

  const sendStartAction = () => {
    setSentStartCommands((prev) => prev + 1);
    const ele = document.getElementsByTagName('iframe');
    if (ele && ele.length > 0 && ele[0]) {
      ele[0].contentWindow?.postMessage({ type: 'START', value: '' }, '*');
    }
  };

  const sendStopAction = () => {
    setSentStartCommands(0);
    console.log('Stopping connection');
    const ele = document.getElementsByTagName('iframe');
    if (ele && ele.length > 0 && ele[0]) {
      ele[0].contentWindow?.postMessage({ type: 'STOP', value: '' }, '*');
      console.log('Stop live msg sent');
    }
  };

  const sendReloadAction = () => {
    setSentStartCommands(0);
    console.log('Reload connection');
    const ele = document.getElementsByTagName('iframe');
    if (ele && ele.length > 0 && ele[0]) {
      ele[0].contentWindow?.postMessage({ type: 'RELOAD', value: '' }, '*');
      console.log('Reload live msg sent');
    }
  };

  const updateJoinedCounts = (zUsers: ZoomUser[]) => {
    const userMap: StudentConnection = {};
    for (const u of zUsers) {
      if (!userMap[u.userName]) {
        userMap[u.userName] = {
          count: 0,
          name: u.userName,
        };
      }
      userMap[u.userName].count += 1;
      if (userMap[u.userName].count > 1 && u.userName !== Util.fullName) {
        // eslint-disable-next-line no-new
        new Notification('Multiple users in one name', { body: userMap[u.userName].name, icon: logo });
        // console.error('user:', userMap[u.userName].name);
      }
    }
    setUsers(userMap);
  };

  const onMsgZoomClientListener = useCallback((e) => {
    const atts = e.data;
    if (atts.data?.userName === Util.fullName) {
      console.error('Teache name used to login', atts.data);
      return;
    }

    if (atts.type === 'CONNECT') {
      setConnected(true);
    } else if (atts.type === 'JOIN') {
      setConnected(true);
      const zUser: ZoomUser = atts.data;

      memeberCount.current += 1;
      setUserNames((prev) => {
        const clone = [...prev, atts.data];
        updateJoinedCounts(clone);
        return clone;
      });

      const lesson = selectedLesson.current;

      if (lesson) {
        const userPayment = paymentsForSelectedLesson.current?.find(
          (pay) => pay.ownerName === zUser.userName);
        if (!userPayment) {
          setNonPaid((prev) => {
            const clone = [...prev, zUser];
            // Handle users logged in with teacher's name
            if (Util.fullName === zUser.userName) {
              const userCountWithTeacherName = clone.filter((u) => u.userName === Util.fullName);
              if (userCountWithTeacherName?.length > 2) {
                // eslint-disable-next-line no-new
                // new Notification('Non Paid User Detected', { body: zUser.userName, icon: logo });
                console.error('User connected with:', zUser.userName);
              }
            } else {
              // eslint-disable-next-line no-new
              new Notification('Non Paid User Detected', { body: zUser.userName, icon: logo });
            }

            return clone;
          });
        }
      }
    } else if (atts.type === 'LEAVE') {
      const luser = atts.data;
      setUserNames((prev) => {
        const clone = [...prev.filter((user) => user.userName !== luser.userName)];
        updateJoinedCounts(clone);
        return clone;
      });
      setNonPaid((prev) => {
        const clone = [...prev.filter((user) => user.userName !== luser.userName)];
        // updateNewStudents(clone);
        return clone;
      });
    }
  }, []);

  const onBeforeunloadListener = useCallback((event) => {
    // eslint-disable-next-line no-use-before-define
    disconnectAll();
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Older browsers supported custom message
    event.returnValue = '';
    // eslint-disable-next-line
  }, []);

  const disconnectAll = useCallback(() => {
    sendStopAction();

    setDisconnected(true);
    clearInterval(startConnectTimerRef.current);

    // TODO: what is meant by false here
    window.removeEventListener('message', onMsgZoomClientListener, false);
    // eslint-disable-next-line no-use-before-define
    window.removeEventListener('beforeunload', onBeforeunloadListener, false);

    setTimeout(() => {
      setConnected(false);
    }, 1000);
  }, [onBeforeunloadListener, onMsgZoomClientListener]);

  const startVideoRendering = (lesson: ILiveLesson, userNames: ZoomUser[], paymentForLesson: IPayment[]) => {
    sendStartAction();
    let startActionCount = 0;
    startConnectTimerRef.current = setInterval(() => {
      console.log('send start mkpt', startActionCount += 1);
      sendStartAction();

      if (startActionCount > REPEAT_START_TIMES) {
        if (memeberCount.current === 0) {
          startActionCount = 0;
          sendReloadAction();
        } else {
          clearInterval(startConnectTimerRef.current);
        }
      }
    }, 1000);
  };

  const fetchLesson = async () => {
    getDocWithId<ILiveLesson>(Entity.LESSONS_LIVE, lessonId).then((lesson) => {
      if (!lesson) return;
      setLesson(lesson);
    });
  };

  const processVideo = async () => {
    getDocWithId<ILiveLesson>(Entity.LESSONS_LIVE, lessonId).then((lesson) => {
      if (!lesson) return;

      getDocWithId<ITeacher>(Entity.TEACHERS, lesson.ownerEmail).then((teacher) => {
        teacher && setTeacher(teacher);

        if (email) {
          getDocsWithProps<IPayment>(Entity.PAYMENTS_STUDENTS,
            { lessonId }).then((data) => {
            setLesson(lesson);
            selectedLesson.current = lesson;
            paymentsForSelectedLesson.current = data;
            setPaymentsForLesson(data);
            startVideoRendering(lesson, userNames, data);
          });
        } else {
          showSnackbar('Please login with your gmail address');
        }
      });
    });
  };

  useEffect(() => {
    fetchLesson();
    Notification.requestPermission().then((result) => {
      console.log(result);
    });

    return () => {
      disconnectAll();
    };
    // eslint-disable-next-line
  }, []);

  const strtCheckZoomAttendance = () => {
    // TODO: what is false here
    window.addEventListener('message', onMsgZoomClientListener, false);
    window.addEventListener('beforeunload', onBeforeunloadListener, false);
    setZoomStarted(true);
    processVideo();
  };

  const getIframe = (teacher: ITeacher) => (
    <>
      <iframe
        src={`${Config.zoomURL}?&a=${getHashFromString(teacher.zoomMeetingId)}&a=${
          getHashFromString(teacher.zoomPwd)}&a=${getHashFromString(Util.fullName)}`}
        name="iframe_a"
        height="300px"
        width="100%"
        style={{ visibility: 'hidden' }}
        allow="camera *;microphone *"
        title="Live Lessons"
      />
    </>
  );

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>Zoom Attendance Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={classes.root}>
          { (lesson && !disconnected && zoomStarted) ? (
            <div>
              {connected && (
              <div>
                <h4 style={{ color: 'red' }}>Click `DISCONNECT` before reload/close the page</h4>
                <Button onClick={disconnectAll}>
                  Disconnect
                </Button>
              </div>
              )}

              {!connected && (
              <h4>
                {`Connecting to meeting... ${REPEAT_START_TIMES - sentStartCommands}`}
              </h4>
              )}

              <div className={classes.check}>
                <table className={classes.payList}>
                  <tbody>
                    <tr><th>Not paid ZOOM students for this lesson</th></tr>
                    {
                nonPaid.map((usr) => (
                  <tr key={usr.userId}>
                    <td>{usr.userId}</td>
                    <td>{usr.userName}</td>
                    <td>Not Paid</td>
                  </tr>
                ))
              }

                    <tr><th>Paid ZOOM students for this lesson</th></tr>
                    {paymentForLesson.sort((b, a) => (users[a.ownerName]?.count ?? 0)
                     - (users[b.ownerName]?.count ?? 0)).map((pay) => (
                       <tr key={pay.id}>
                         <td>{pay.ownerEmail}</td>
                         <td>{pay.ownerName}</td>
                         <td>{users[pay.ownerName]?.count ?? 0}</td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {teacher && lesson.isRunning
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
          ) : <h4>Zoom Attendance Disconnected</h4> }
          <button
            onClick={strtCheckZoomAttendance}
            type="button"
          >
            Check Zoom attendance
          </button>
        </div>
      </AccordionDetails>
    </Accordion>

  );
};
