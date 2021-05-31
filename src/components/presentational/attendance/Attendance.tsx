import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import Config from '../../../data/Config';
import { Entity, getDocsWithProps } from '../../../data/Store';
import { IAttendance } from '../../../interfaces/IAttendance';

interface Props {
    lessonId: string;
}
export const Attendance: React.FC<Props> = ({ lessonId }) => {
  const checkAttendanceTimer = useRef<any>();
  const [attendanceList, setAttendanceList] = useState<IAttendance[]>([]);

  const checkAttendance = () => {
    getDocsWithProps<IAttendance>(Entity.ATTENDANCE, {
      lessonId,
    }).then((data) => setAttendanceList(data));
  };
  useEffect(() => {
    checkAttendanceTimer.current = setInterval(checkAttendance, Config.liveAttendanceCheckInterval);

    return () => {
      clearInterval(checkAttendanceTimer.current);
    };
  }, []);

  return <div>{attendanceList.map((atten) => <div>{atten.ownerEmail}</div>)}</div>;
};
