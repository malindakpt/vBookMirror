/* eslint-disable jsx-a11y/media-has-caption */
import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
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

interface StudentConnection {
  [key: string]: {
    // email: string;
    name: string;
    count: number;
  }
}
interface ZoomUser{
  userName: string;
  userId: string;
}
const REPEAT_START_TIMES = 25;
export const LiveLessonTeacher: React.FC = () => {
  const { email, showSnackbar } = useContext(AppContext);

  // disable context menu for avoid right click
  document.addEventListener('contextmenu', (event) => event.preventDefault());

  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [lesson, setLesson] = useState<ILiveLesson>();
  const [userNames, setUserNames] = useState<ZoomUser[]>([]);
  const [paymentForLesson, setPaymentsForLesson] = useState<IPayment[]>([]);
  const [nonPaid, setNonPaid] = useState<ZoomUser[]>([]);

  const [users, setUsers] = useState< StudentConnection >({});
  const [connected, setConnected] = useState<boolean>(false);
  const [reloadText, setReloadText] = useState<string>('Reload');
  const [sentStartCommands, setSentStartCommands] = useState<number>(0);
  const [connectingText, setConnectingText] = useState<string>('Connecting to meeting...');

  const sendStartAction = () => {
    setSentStartCommands((prev) => prev + 1);
    const ele = document.getElementsByTagName('iframe');
    if (ele && ele.length > 0 && ele[0]) {
      ele[0].contentWindow?.postMessage({ type: 'START', value: '' }, '*');
    }
  };

  const stopLive = () => {
    console.log('Stopping connection');
    setReloadText('Disconnecting...');
    const ele = document.getElementsByTagName('iframe');
    if (ele && ele.length > 0 && ele[0]) {
      ele[0].contentWindow?.postMessage({ type: 'STOP', value: '' }, '*');
    }
    // setTimeout(() => {
    //   window.location.reload();
    // }, 3000);
  };

  const updateNewStudents = (zUsers: ZoomUser[]) => {
    const userMap: StudentConnection = {};
    for (const u of zUsers) {
      if (!userMap[u.userName]) {
        userMap[u.userName] = {
          count: 0,
          name: u.userName,
        };
      }
      userMap[u.userName].count += 1;
    }
    setUsers(userMap);
  };

  const startVideoRendering = (lesson: ILiveLesson, userNames: ZoomUser[]) => {
    sendStartAction();
    const glob: any = window;
    window.addEventListener('message', (e) => {
      const atts = e.data;
      if (atts.type === 'CONNECT') {
        setConnected(true);
      } else if (atts.type === 'JOIN') {
        glob.count = glob.count ? glob.count + 1 : 1;
        setUserNames((prev) => {
          const clone = [...prev, atts.data];
          updateNewStudents(clone);
          return clone;
        });

        const zUser: ZoomUser = atts.data;
        if (lesson && (lesson?.price > 0)) {
          const userPayment = paymentForLesson.find((pay) => pay.ownerEmail === zUser.userName);
          if (!userPayment) {
            setNonPaid((prev) => {
              const clone = [...prev, zUser];
              // Handle users logged in with teacher's name
              if (Util.fullName === zUser.userName) {
                const userCountWithTeacherName = clone.filter((u) => u.userName === Util.fullName);
                if (userCountWithTeacherName?.length > 2) {
                  // eslint-disable-next-line no-new
                  new Notification('Non Paid User Detected', { body: zUser.userName, icon: logo });
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
          updateNewStudents(clone);
          return clone;
        });
        setNonPaid((prev) => {
          const clone = [...prev.filter((user) => user.userName !== luser.userName)];
          updateNewStudents(clone);
          return clone;
        });
      }
    }, false);

    glob.timer = setInterval(() => {
      console.log('send start mkpt');
      sendStartAction();
    }, 1000);

    setTimeout(() => {
      clearInterval(glob.timer);
      if (!glob.count) {
        glob.removeEventListener('beforeunload', glob.beforeunload);
        setConnectingText('Could not connect to meeting. Reloading...');
        window.location.reload();
      }
    }, REPEAT_START_TIMES * 1000);
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
            startVideoRendering(lesson, userNames);
          });
        } else {
          showSnackbar('Please login with your gmail address');
        }
      });
    });
  };

  useEffect(() => {
    const glob: any = window;
    Notification.requestPermission().then((result) => {
      console.log(result);
    });

    glob.beforeunload = (event: any) => {
      console.log('Unmounting...');
      stopLive();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', glob.beforeunload);
    processVideo();

    return () => {
      glob.removeEventListener('beforeunload', glob.beforeunload);
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
        style={{ visibility: 'hidden' }}
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

        {connected && (
        <Button onClick={() => {
          stopLive();
        }}
        >
          {reloadText}
        </Button>
        )}
        {/* {connected && (
        <Button onClick={() => {
          stopLive();
          window.removeEventListener('beforeunload', (window as any).beforeunload);
          setTimeout(() => {
            window.close();
          }, 1000);
        }}
        >
          Close this window
        </Button>
        )} */}

          {!connected && (
          <Button>
            {`${connectingText} ${REPEAT_START_TIMES - sentStartCommands}`}
          </Button>
          )}

        <div className={classes.check}>
          <table className={classes.payList}>
            <tbody>
              {
                nonPaid.filter((np) => np.userName !== Util.fullName).map((usr) => (
                  <tr key={usr.userId}>
                    <td>{usr.userId}</td>
                    <td>{usr.userName}</td>
                    <td>Not Paid</td>
                  </tr>
                ))
              }
              {paymentForLesson.sort((a, b) => (users[a.ownerName]?.count ?? 0) - (users[b.ownerName]?.count ?? 0)).map((pay) => (
                <tr key={pay.id}>
                  <td>{pay.ownerEmail}</td>
                  <td>{pay.ownerName}</td>
                  <td>{users[pay.ownerName]?.count ?? 0}</td>
                </tr>
              ))}
            </tbody>
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
