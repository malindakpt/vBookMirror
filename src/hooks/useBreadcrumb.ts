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
    examId, subjectId, courseId, teacherId,
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
    let bcs;
    if (teacherId) {
      bcs = [
        ['Subjects', `/teacher/${teacherId}`],
      ];

      if (courseId) {
        const text = keyMap[keyMap[courseId]?.subjectId]
          ? `${keyMap[keyMap[courseId].subjectId].name}` : 'Lessons';
        bcs.push([text,
          `/teacher/${teacherId}/${courseId}`]);
      }
    } else {
      bcs = [
        ['Exams', '/'],
      ];

      if (!teacherId && examId !== 'teacher') {
        if (examId) {
          const text = keyMap[examId] ? `${keyMap[examId].name} ${keyMap[examId].type ?? ''}` : 'Subjects';
          bcs.push([text, `/${examId}`]);
        }
        if (subjectId) {
          const text = keyMap[subjectId] ? `${keyMap[subjectId].name}` : 'Tutors';
          bcs.push([text, `/${examId}/${subjectId}`]);
        }
        if (courseId) {
          const text = keyMap[courseId] && keyMap[keyMap[courseId].teacherId]
            ? `${keyMap[keyMap[courseId].teacherId].name}` : 'Lessons';
          bcs.push([text,
            `/${examId}/${subjectId}/${courseId}`]);
        }
      }
    }
    sendBreadcrumbs(bcs);
  },
  [examId, subjectId, courseId, sendBreadcrumbs, teacherId]);

  return updateKeyMap;
};
