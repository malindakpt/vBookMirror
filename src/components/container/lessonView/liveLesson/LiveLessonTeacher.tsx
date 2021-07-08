/* eslint-disable jsx-a11y/media-has-caption */
import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import classes from './LiveLesson.module.scss';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { ILiveLesson } from '../../../../interfaces/ILesson';
import {
  Entity, getDocWithId,
} from '../../../../data/Store';
import { StudentQuestions } from '../../../presentational/studentQuestions/StudentQuestions';
import { Attendance } from '../../../presentational/attendance/Attendance';
import { AttendaceZoom } from '../../../presentational/attendanceZoom/AttendanceZoom';

export const LiveLessonTeacher: React.FC = () => {
  // disable context menu for avoid right click
  document.addEventListener('contextmenu', (event) => event.preventDefault());

  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [lesson, setLesson] = useState<ILiveLesson>();

  const fetchLesson = useCallback(async () => {
    getDocWithId<ILiveLesson>(Entity.LESSONS_LIVE, lessonId).then((lesson) => {
      if (!lesson) return;
      setLesson(lesson);
    });
  }, [lessonId]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson, lessonId]);

  return (
    <div className={classes.root}>
      <div className={classes.topic}>
        {lesson?.topic}
      </div>
      <div className={classes.desc}>
        {lesson?.description}
      </div>
      <StudentQuestions lessonId={lessonId} />
      <Attendance lessonId={lessonId} />
      <AttendaceZoom />
    </div>
  );
};
