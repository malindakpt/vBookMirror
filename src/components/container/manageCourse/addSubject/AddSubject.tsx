import React, { useState, useContext, useEffect } from 'react';
import {
  TextField, Button,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { ISubject } from '../../../../data/Interfaces';
import { addDoc, getDocsWithProps } from '../../../../data/Store';
import { AppContext } from '../../../../App';
import { ListItems } from '../../../presentational/ListItems/ListItemsComponent';

export const AddSubject = () => {
  const { showSnackbar } = useContext(AppContext);
  const [subject, setSubject] = useState<ISubject>();
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  const setSubjectProps = (obj: any) => {
    setSubject((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  useEffect(() => {
    getDocsWithProps('subjects', {}, {}).then((data) => setSubjects(data));
    // eslint-disable-next-line
  },[])

  const onSave = () => {
    addDoc('subjects', subject).then(() => showSnackbar('Subject added'));
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
      <ListItems list={subjects} />
    </>
  );
};
