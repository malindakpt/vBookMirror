import React, { useState, useEffect, useContext } from 'react';
import {
  TextField, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText,
} from '@material-ui/core';
import ContactsIcon from '@material-ui/icons/Contacts';
import classes from '../ManageCourse.module.scss';
import { ITeacher } from '../../../../data/Interfaces';
import { addDoc, getDocsWithProps } from '../../../../data/Store';
import { ListItems } from '../../../presentational/ListItems/ListItemsComponent';
import { AppContext } from '../../../../App';

export const AddTeacher = () => {
  const { showSnackbar } = useContext(AppContext);
  const [teacher, setTeacher] = useState<ITeacher>();
  const [teachers, setTeachers] = useState<ITeacher[]>([]);

  useEffect(() => {
    getDocsWithProps('teachers', {}, {}).then((data) => setTeachers(data));
  }, []);

  const setSubjectProps = (obj: any) => {
    setTeacher((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  const onSave = () => {
    addDoc('teachers', teacher).then(() => showSnackbar('Teacher is added'));
  };

  return (
    <>
      <h3>Add Teacher</h3>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >

        <TextField
          className={classes.input}
          id="teacherName"
          label="Teacher Name"
          onChange={(e) => setSubjectProps({ name: e.target.value })}
        />

        <Button
          variant="contained"
          onClick={onSave}
        >
          Add
        </Button>

        <ListItems list={teachers} />
      </form>
    </>
  );
};
