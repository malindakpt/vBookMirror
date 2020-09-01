import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl, FormControlLabel, Checkbox,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, getDocsWithProps } from '../../../../data/Store';
import {
  ILesson, ICourse, ITeacher, IExam, ISubject,
} from '../../../../meta/Interfaces';
import { getCourses, getSubject, getExam } from '../../../../meta/DataHandler';

export const AddSubject = () => {
  const [exams, setExams] = useState<IExam[]>();
  const [selectedExamIds, setSelectedExamIds] = useState<string[]>([]);
  const [subject, setSubject] = useState<ISubject>();
  const [courses, setCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    getDocsWithProps('exams', {}, {}).then((data:IExam[]) => setExams(data));
  }, []);

  const setSubjectProps = (obj: any) => {
    setSubject((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  const onExamChange = (e: any) => {
    const { id } = e.target;
    const { checked } = e.target;
    const exists = selectedExamIds.findIndex((ex) => ex === id);
    if (checked) {
      if (exists === -1) {
        setSelectedExamIds((prev) => [id, ...prev]);
      }
    } else if (exists >= 0) {
      setSelectedExamIds((prev) => {
        const next = [...prev];
        next.splice(exists, 1);
        return next;
      });
    }
  };

  const onSave = () => {
    console.log(selectedExamIds);
    // if (!lesson || !lesson.courseId || !lesson.videoURL) {
    //   alert('Invalid inputs');
    // } else {
    //   addDoc('lessons', lesson);
    // }
  };

  return (
    <>
      <h3>Add Subject</h3>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >

        <TextField
          className={classes.input}
          id="subjectName"
          label="Subject Name"
          onChange={(e) => setSubjectProps({ name: e.target.value })}
        />

        <div className={classes.twoColumn}>
          {exams?.map((exam) => (
            <FormControlLabel
              key={exam.id}
              control={(
                <Checkbox
                  id={exam.id}
                  onChange={onExamChange}
                  name="checkedB"
                  color="primary"
                />
        )}
              label={exam.name}
            />
          ))}
        </div>
        <Button
          variant="contained"
          onClick={onSave}
        >
          Add
        </Button>
      </form>
    </>
  );
};
