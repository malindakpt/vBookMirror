import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, getDocsWithProps } from '../../../../data/Store';
import {
  ILesson, ICourse, ITeacher, ISubject,
} from '../../../../meta/Interfaces';
import { getSubject, getExam } from '../../../../meta/DataHandler';

export const AddLesson = () => {
  const [lesson, setLesson] = useState<ILesson>();
  const [selectedCourse, setSelectedCourse] = useState<ICourse>();
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  useEffect(() => {
    getDocsWithProps('teachers', {}, {}).then((data:ITeacher[]) => setTeachers(data));
    getDocsWithProps('subjects', {}, {}).then((data:ISubject[]) => setSubjects(data));
  }, []);

  const setLessonProp = (obj: any) => {
    setLesson((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  const onTeacherChange = (e: any) => {
    setSelectedCourse(e.target.value);
    getDocsWithProps('courses', { teacherId: e.target.value }, {}).then((data: ICourse[]) => {
      setCourses(data);
    });
  };

  const onSave = () => {
    console.log(lesson);
    if (!lesson || !lesson.courseId || !lesson.videoURL) {
      alert('Invalid inputs');
    } else {
      addDoc('lessons', lesson);
    }
  };

  return (
    <>
      <h3>Manage Courses</h3>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >

        <FormControl className={classes.input}>
          <InputLabel id="demo-simple-select-label">Select Teacher</InputLabel>
          <Select
            className={classes.input}
            labelId="label1"
            id="id1"
            value={selectedCourse || ''}
            onChange={onTeacherChange}
          >
            {teachers.map((teacher) => (
              <MenuItem
                value={teacher.id}
                key={teacher.id}
              >
                {`${teacher.name}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classes.input}>
          <InputLabel id="demo-simple-select-label">Select Course</InputLabel>
          <Select
            className={classes.input}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={lesson?.courseId || ''}
            onChange={(e) => setLessonProp({ courseId: e.target.value })}
          >
            {courses.map((course) => (
              <MenuItem
                value={course.id}
                key={course.id}
              >
                {`${getExam(course.examId)?.type}-${getExam(course.examId)?.batch}-${getSubject(subjects, course.subjectId)?.name}-${getExam(course.examId)?.name}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          className={classes.input}
          id="standard-basic"
          label="Video URL"
          onChange={(e) => setLessonProp({ videoURL: e.target.value })}
        />
        <TextField
          className={classes.input}
          id="filled-basic"
          label="Description"
          onChange={(e) => setLessonProp({ description: e.target.value })}
        />
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
