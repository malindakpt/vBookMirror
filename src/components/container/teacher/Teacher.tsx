import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CategoryIcon from '@material-ui/icons/Category';
import { examYears } from '../../../data/Config';
import { getDocsWithProps, getDocWithId } from '../../../data/Store';
import { getObject } from '../../../data/StoreHelper';
import { ICourse } from '../../../interfaces/ICourse';
import { IExam } from '../../../interfaces/IExam';
import { ISubject } from '../../../interfaces/ISubject';
import { Category } from '../../presentational/category/Category';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { ITeacher } from '../../../interfaces/ITeacher';

export const Teacher = () => {
  useBreadcrumb();
  const { id } = useParams<any>();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [teacher, setTeacher] = useState<ITeacher| undefined>(undefined);

  useEffect(() => {
    getDocsWithProps<ICourse[]>('courses', { teacherId: id }).then((data) => setCourses(data));
    getDocsWithProps<ISubject[]>('subjects', {}).then((data) => setSubjects(data));
    getDocsWithProps<IExam[]>('exams', {}).then((data) => setExams(data));
    getDocWithId<ITeacher>('teachers', id).then((dat) => setTeacher(dat));
  }, [id]);

  return (
    <div className="container">
      <h3>{teacher?.name}</h3>
      {
                courses.map((c) => {
                  const subj = getObject(subjects, c.subjectId);
                  const examTime = getObject(examYears, c.examYear);
                  const exam = getObject(exams, c.examId);
                  return (
                    <Category
                      key={c.id}
                      title1={`${subj?.name} ${exam?.type}`}
                      title2={`${examTime?.name} ${exam?.name}`}
                      navURL=""
                      CategoryImg={CategoryIcon}
                    />
                  );
                })
            }
    </div>
  );
};
