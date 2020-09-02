import {
  useEffect, useContext, useState, useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../App';

export const useBreadcrumb = () => {
  const { examId, subjectId, courseId } = useParams();
  const { updateBreadcrumbs } = useContext(AppContext);

  const [breadcrumbs, setBreadcrumbs] = useState<any>([]);

  const sendBreadcrumbs = useCallback((bcs: any[]) => {
    if (bcs.length === breadcrumbs.length) {
      return;
    }
    updateBreadcrumbs(bcs);
    setBreadcrumbs(bcs);
  }, []);

  useEffect(() => {
    const bcs = [
      ['Exams', '/'],
    ];

    if (examId) {
      // const exam = getExam(examId);
      // if (exam) {
      bcs.push(['Subjects', `/${examId}`]);
      // bcs.push([`${exam.name}-${exam.batch}-${exam.type}` || '', `/${examId}`]);
      // } else {
      //   sendBreadcrumbs(bcs);
      //   return;
      // }
    }
    if (subjectId) {
      bcs.push(['Courses', `/${examId}/${subjectId}`]);
    }
    if (courseId) {
      bcs.push(['Lessons',
        `/${examId}/${subjectId}/${courseId}`]);
    }
    sendBreadcrumbs(bcs);
  },
  [examId, subjectId, courseId, sendBreadcrumbs]);
};
