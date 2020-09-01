import { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getExam, getSubject } from '../meta/DataHandler';
import { AppContext } from '../App';

export const useBreadcrumb = () => {
  const { examId, subjectId, courseId } = useParams();
  const { updateBreadcrumbs } = useContext(AppContext);

  useEffect(() => {
    const bcs = [
      ['Home', '/'],
    ];

    if (examId) {
      const exam = getExam(examId);
      if (exam) {
        bcs.push([`${exam.name}-${exam.batch}-${exam.type}` || '', `/${examId}`]);
      } else {
        updateBreadcrumbs(bcs);
        return;
      }
    }
    if (subjectId) {
      bcs.push([getSubject(subjectId)?.name || '', `/${examId}/${subjectId}`]);
    }
    if (courseId) {
      bcs.push(['Contents',
        `/${examId}/${subjectId}/${courseId}`]);
    }
    updateBreadcrumbs(bcs);
  },
  [examId, subjectId, courseId, updateBreadcrumbs]);
};
