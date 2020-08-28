import React from 'react';
import { useParams } from 'react-router-dom';
import { getCourse } from '../../../meta/DataHandler';

export const Course: React.FC = () => {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  return (
    <div>
      Course:
      {course?.id}
    </div>
  );
};
