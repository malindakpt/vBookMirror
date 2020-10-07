import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { Category } from '../../presentational/category/Category';
import { getObject } from '../../../data/StoreHelper';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { getDocsWithProps } from '../../../data/Store';
import { ICourse } from '../../../interfaces/ICourse';
import { ITeacher } from '../../../interfaces/ITeacher';
import { IExam } from '../../../interfaces/IExam';

export const Courses: React.FC = () => {
  const keyMap = useBreadcrumb();

  const { subjectId, examId, year } = useParams<any>();

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);

  useEffect(() => {
    getDocsWithProps<ICourse[]>('courses', { subjectId, examId, examYear: year })
      .then((data) => {
        setCourses(data);
        keyMap(data);
      });
    getDocsWithProps<ITeacher[]>('teachers', {}).then((data) => {
      setTeachers(data);
      keyMap(data);
    });
    getDocsWithProps<IExam[]>('exams', {}).then((data) => setExams(data));
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      <h3>Courses</h3>
      {courses.map((course) => {
        // const subject = getObject(subjects, course.subjectId);
        const teacher = getObject(teachers, course.teacherId);
        const exam = getObject(exams, course.examId);

        return (
          <Category
            key={course.id}
            CategoryImg={ListAltIcon}
            title1={teacher?.name}
            title2={` ${exam?.type} [${exam?.name}]`}
            navURL={`${subjectId}/${course.id}`}
          />
        );
      })}
    </div>
  );
};