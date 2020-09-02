import {
  useEffect, useContext, useState, useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import { getExam } from '../meta/DataHandler';
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
      ['Home', '/'],
    ];

    if (examId) {
      // const exam = getExam(examId);
      // if (exam) {
      bcs.push(['Exam', `/${examId}`]);
      // bcs.push([`${exam.name}-${exam.batch}-${exam.type}` || '', `/${examId}`]);
      // } else {
      //   sendBreadcrumbs(bcs);
      //   return;
      // }
    }
    if (subjectId) {
      bcs.push([subjectId || '', `/${examId}/${subjectId}`]);
    }
    if (courseId) {
      bcs.push(['Contents',
        `/${examId}/${subjectId}/${courseId}`]);
    }
    sendBreadcrumbs(bcs);
  },
  [examId, subjectId, courseId, sendBreadcrumbs]);
};
