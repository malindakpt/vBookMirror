import React, {
  useCallback,
  useEffect, useRef, useState,
} from 'react';
import classes from './Attendance.module.scss';
import Config from '../../../data/Config';
import { Entity, getDocsWithProps } from '../../../data/Store';
import { IAttendance } from '../../../interfaces/IAttendance';
import logo from '../../../images/logo.png';

interface Props {
    lessonId: string;
}
export const Attendance: React.FC<Props> = ({ lessonId }) => {
  const checkAttendanceTimer = useRef<any>();
  const [attendanceList, setAttendanceList] = useState<IAttendance[]>([]);
  const addedUsers = useRef<Record<string, boolean>>({});
  const reportedUsers = useRef<Record<string, boolean>>({});

  const checkAttendance = useCallback(() => {
    getDocsWithProps<IAttendance>(Entity.ATTENDANCE, {
      lessonId,
    }).then((data) => {
      if (data) {
        addedUsers.current = {};
        data.forEach((user) => {
          if (addedUsers.current[user.ownerEmail]) {
            if (!reportedUsers.current[user.ownerEmail]) {
            // eslint-disable-next-line no-new
              new Notification('Shared Account Detected', { body: user.ownerEmail, icon: logo });
              reportedUsers.current[user.ownerEmail] = true;
            }
          }
          addedUsers.current[user.ownerEmail] = true;
        });
      }
      setAttendanceList(data);
    });
  }, [lessonId]);

  useEffect(() => {
    checkAttendanceTimer.current = setInterval(checkAttendance, Config.liveAttendanceCheckInterval);

    return () => {
      clearInterval(checkAttendanceTimer.current);
    };
  }, [checkAttendance]);

  const activeGap = (time: number) => {
    const now = new Date().getTime();
    return Math.round((now - time) / 60000);
  };

  return (
    <div>
      {attendanceList.map((att) => ({ ...att, gap: activeGap(att.timestamp) })).sort((a, b) => a.timestamp - b.timestamp)
        .map((atten) => (
          <div
            className={classes.container}
            key={atten.timestamp}
          >
            <div>{atten.id}</div>
            <div>{atten.gap > 0 ? `${atten.gap} mins.` : 'LIVE'}</div>
            <div>{new Date(atten.timestamp).toUTCString()}</div>
          </div>
        ))}
    </div>
  );
};
