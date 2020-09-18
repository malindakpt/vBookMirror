import React, { useState, useEffect, useContext } from 'react';
import {
  TextField, Button,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, getDocsWithProps } from '../../../../data/Store';
import { ListItems } from '../../../presentational/ListItems/ListItemsComponent';
import { AppContext } from '../../../../App';
import { useForcedUpdate } from '../../../../hooks/useForcedUpdate';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';

export const AddTeacher = () => {
  useBreadcrumb();
  const [onUpdate, updateUI] = useForcedUpdate();
  const { showSnackbar } = useContext(AppContext);
  const [teacher, setTeacher] = useState<ITeacher>();
  const [teachers, setTeachers] = useState<ITeacher[]>([]);

  useEffect(() => {
    // display existing teachers
    getDocsWithProps<ITeacher[]>('teachers', {}).then((data) => setTeachers(data));
  }, [onUpdate]);

  const setTeacherProps = (obj: any) => {
    setTeacher((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  const onSave = () => {
    addDoc('teachers', teacher).then(() => {
      showSnackbar('Teacher is added');
      updateUI();
    });
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
          onChange={(e) => setTeacherProps({ name: e.target.value })}
        />

        <TextField
          className={classes.input}
          id="email"
          label="Email Address"
          onChange={(e) => setTeacherProps({ email: e.target.value })}
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
