/* eslint-disable jsx-a11y/media-has-caption */
import { useParams } from 'react-router-dom';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import classes from './LiveLesson.module.scss';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { ILiveLesson } from '../../../../interfaces/ILesson';
import {
  Entity, getDocWithId,
} from '../../../../data/Store';
import { StudentQuestions } from '../../../presentational/studentQuestions/StudentQuestions';
import { Attendance } from '../../../presentational/attendance/Attendance';
import { AttendaceZoom } from '../../../presentational/attendanceZoom/AttendanceZoom';
import { AppContext } from '../../../../App';
import { Util } from '../../../../helper/util';
import { ADMIN_EMAIL } from '../../../../data/Config';

export const LiveLessonTeacher: React.FC = () => {
  // disable context menu for avoid right click
  document.addEventListener('contextmenu', (event) => event.preventDefault());
  const { email, showSnackbar } = useContext(AppContext);

  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [lesson, setLesson] = useState<ILiveLesson>();

  const fetchLesson = useCallback(async () => {
    getDocWithId<ILiveLesson>(Entity.LESSONS_LIVE, lessonId).then((lesson) => {
      if (lesson) {
        if (email && (email === lesson.ownerEmail || email === lesson.assistantEmail  || email === ADMIN_EMAIL)) {
          setLesson(lesson);
        } else {
          if (email) {
            showSnackbar(`${email} is not allowed to view this page`);
          } else {
            showSnackbar(`Please login with your email address`);
            Util.invokeLogin();
          }
        }
      }
    });
  }, [lessonId, email, showSnackbar]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  return (
    <div className={classes.root}>
      <div className={classes.topic}>
        {lesson?.topic}
      </div>
      <div className={classes.desc}>
        {lesson?.description}
      </div>
      {lesson && <div>
        <StudentQuestions lessonId={lessonId} />
        <Attendance lessonId={lessonId} />
        <AttendaceZoom />
      </div>}
    </div>
  );
};
