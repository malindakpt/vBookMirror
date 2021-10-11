import React, {
  useCallback,
  useEffect, useRef, useState,
} from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classes from './Attendance.module.scss';
import Config from '../../../data/Config';
import { Entity, getDocWithId } from '../../../data/Store';
import { IAttendance, IStudentAttendanceRecord } from '../../../interfaces/IAttendance';
import logo from '../../../images/logo.png';

interface Props {
    lessonId: string;
}
export const Attendance: React.FC<Props> = ({ lessonId }) => {
  const checkAttendanceTimer = useRef<any>();
  const [attendanceList, setAttendanceList] = useState<Record<string, IStudentAttendanceRecord>>({});
  const addedUsers = useRef<Record<string, boolean>>({});
  const reportedUsers = useRef<Record<string, boolean>>({});

  const checkAttendance = useCallback(() => {
    getDocWithId<IAttendance>(Entity.ATTENDANCE,
      lessonId, false).then((data) => {
      if (data) {
        addedUsers.current = {};
        Object.values(data.students).forEach((user) => {
          if (addedUsers.current[user.ownerEmail]) {
            if (!reportedUsers.current[user.ownerEmail]) {
            // eslint-disable-next-line no-new
              new Notification('Shared Account Detected', { body: user.ownerEmail, icon: logo });
              reportedUsers.current[user.ownerEmail] = true;
            }
          }
          addedUsers.current[user.ownerEmail] = true;
        });
        setAttendanceList(data.students);
      }
    });
  }, [lessonId]);

  useEffect(() => {
    if (checkAttendanceTimer.current) {
      clearInterval(checkAttendanceTimer.current);
    }
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
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>Attendance Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          {Object.values(attendanceList).map((att) => ({ ...att, gap: activeGap(att.timestamp) })).sort(
            (a, b) => a.timestamp - b.timestamp,
          )
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
      </AccordionDetails>
    </Accordion>

  );
};
