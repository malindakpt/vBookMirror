import React, { useState, useEffect } from 'react';
import {
  TextField, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText,
} from '@material-ui/core';
import ContactsIcon from '@material-ui/icons/Contacts';
import classes from '../ManageCourse.module.scss';
import { ITeacher } from '../../../../meta/Interfaces';
import { addDoc, getDocsWithProps } from '../../../../data/Store';

export const AddTeacher = () => {
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
    addDoc('teachers', teacher);
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

        <List className={classes.oneColumn}>
          { teachers.map((teach) => (
            <ListItem key={teach.id}>
              <ListItemAvatar>
                <Avatar>
                  <ContactsIcon style={{ fontSize: 40 }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={teach.name}
                secondary={teach.id}
              />
            </ListItem>
          ))}
        </List>
      </form>
    </>
  );
};
