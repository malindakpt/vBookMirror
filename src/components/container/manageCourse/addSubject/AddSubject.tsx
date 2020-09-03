import React, { useState } from 'react';
import {
  TextField, Button,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { ISubject } from '../../../../data/Interfaces';
import { addDoc } from '../../../../data/Store';

export const AddSubject = () => {
  const [subject, setSubject] = useState<ISubject>();

  const setSubjectProps = (obj: any) => {
    setSubject((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  const onSave = () => {
    addDoc('subjects', subject);
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
