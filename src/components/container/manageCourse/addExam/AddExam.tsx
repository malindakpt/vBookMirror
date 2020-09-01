import React, { useState } from 'react';
import {
  TextField, Button,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc } from '../../../../data/Store';
import { IExam } from '../../../../meta/Interfaces';

export const AddExam = () => {
  const [exam, setExam] = useState<IExam>();

  const setExamProps = (obj: any) => {
    setExam((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  const onSave = () => {
    console.log(exam);
    addDoc('exams', exam);
  };

  return (
    <>
      <h3>Add Exam</h3>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <TextField
          className={classes.input}
          id="subjectName"
          label="Exam Name"
          onChange={(e) => setExamProps({ name: e.target.value })}
        />

        <TextField
          className={classes.input}
          id="subjectName"
          label="Batch/Year of exam"
          onChange={(e) => setExamProps({ batch: e.target.value })}
        />

        <TextField
          className={classes.input}
          id="subjectName"
          label="Type Theory/Revision"
          onChange={(e) => setExamProps({ type: e.target.value })}
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
