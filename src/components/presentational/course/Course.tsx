import React from 'react';
import { useParams } from 'react-router-dom';
import { getCourse } from '../../util';

interface Props {
    // teacherName: string;
    // subjectName: string;
}
export const Course: React.FC<Props> = () => {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  return (
    <div>
      Course:
      {course?.id}
    </div>
  );
};
