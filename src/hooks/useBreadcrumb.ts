import {
  useEffect, useContext, useState, useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../App';

export const useBreadcrumb = () => {
  const {
    examId, year, subjectId, courseId,
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

    if (examId) {
      bcs.push(['Exam Year', `/${examId}`]);
    }
    if (year) {
      bcs.push(['Subjects', `/${examId}/${year}`]);
    }
    if (subjectId) {
      bcs.push(['Courses', `/${examId}/${year}/${subjectId}`]);
    }
    if (courseId) {
      bcs.push(['Lessons',
        `/${examId}/${year}/${subjectId}/${courseId}`]);
    }
    sendBreadcrumbs(bcs);
  },
  [examId, subjectId, courseId, sendBreadcrumbs, year]);
};
