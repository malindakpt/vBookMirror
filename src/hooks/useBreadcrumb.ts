import {
  useEffect, useContext, useState, useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../App';

const keyMap: any = {};

const updateKeyMap = (objs?: any[]) => {
  if (!objs) return;

  objs.forEach((obj) => {
    keyMap[obj.id] = obj;
  });
};

export const useBreadcrumb = () => {
  const {
    examId, year, subjectId, courseId, teacherId,
  } = useParams<any>();
  const { updateBreadcrumbs } = useContext(AppContext);

  const [breadcrumbs, setBreadcrumbs] = useState<any>([]);

  const sendBreadcrumbs = useCallback((bcs: any[]) => {
    if (bcs.length === breadcrumbs.length) {
      return;
    }
    updateBreadcrumbs(bcs);
    setBreadcrumbs(bcs);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const bcs = [
      ['Exams', '/'],
    ];

    if (!teacherId) {
      if (examId) {
        const text = keyMap[examId] ? `${keyMap[examId].name}-${keyMap[examId].type}` : 'Exam Year';
        bcs.push([text, `/${examId}`]);
      }
      if (year) {
        const text = keyMap[year] ? `${keyMap[year].name}` : 'Subjects';
        bcs.push([text, `/${examId}/${year}`]);
      }
      if (subjectId) {
        const text = keyMap[subjectId] ? `${keyMap[subjectId].name}` : 'Courses';
        bcs.push([text, `/${examId}/${year}/${subjectId}`]);
      }
      if (courseId) {
        const text = keyMap[courseId] && keyMap[keyMap[courseId].teacherId]
          ? `${keyMap[keyMap[courseId].teacherId].name}` : 'Lessons';
        bcs.push([text,
          `/${examId}/${year}/${subjectId}/${courseId}`]);
      }
    }
    sendBreadcrumbs(bcs);
  },
  [examId, subjectId, courseId, sendBreadcrumbs, year, teacherId]);

  return updateKeyMap;
};
