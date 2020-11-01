import React, { useState, useEffect, useContext } from 'react';
import {
  TextField, Button,
} from '@material-ui/core';
import { addDocWithId, Entity, getDocsWithProps } from '../../../../data/Store';
import { ListItems } from '../../../presentational/ListItems/ListItemsComponent';
import { AppContext } from '../../../../App';
import { useForcedUpdate } from '../../../../hooks/useForcedUpdate';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import classes from './AddTeacher.module.scss';

export const AddTeacher = () => {
  useBreadcrumb();

  const [busy, setBusy] = useState<boolean>(false);

  const [onUpdate, updateUI] = useForcedUpdate();
  const { showSnackbar } = useContext(AppContext);
  const [teacher, setTeacher] = useState<ITeacher>();
  const [teachers, setTeachers] = useState<ITeacher[]>([]);

  useEffect(() => {
    // display existing teachers
    getDocsWithProps<ITeacher[]>(Entity.TEACHERS, {}).then((data) => setTeachers(data));
  }, [onUpdate]);

  const setTeacherProps = (obj: any) => {
    setTeacher((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  const onSave = async () => {
    setBusy(true);
    if (teacher && teachers.findIndex((t) => t.url === teacher.url
        || t.ownerEmail === teacher.ownerEmail) < 0) {
      addDocWithId<ITeacher>(Entity.TEACHERS, teacher.ownerEmail, teacher).then(() => {
        showSnackbar('New teacher added');
        updateUI();
        setBusy(false);
      });
    } else {
      showSnackbar('Teacher already exists with same params');
      setBusy(false);
    }
  };

  return (
    <>
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
          onChange={(e) => setTeacherProps({ ownerEmail: e.target.value })}
        />

        <TextField
          className={classes.input}
          id="url"
          label="URL"
          onChange={(e) => setTeacherProps({ url: e.target.value })}
        />

        <TextField
          className={classes.input}
          id="phone"
          label="Phone"
          onChange={(e) => setTeacherProps({ phone: e.target.value })}
        />

        <TextField
          className={classes.input}
          id="phoneChat"
          label="+9477.... Phone Chat"
          onChange={(e) => setTeacherProps({ phoneChat: e.target.value })}
        />

        <TextField
          className={classes.input}
          type="number"
          id="commission"
          label="Video Commission Rate"
          onChange={(e) => setTeacherProps({ commission: Number(e.target.value) })}
        />

        <TextField
          className={classes.input}
          type="number"
          id="commissionLive"
          label="Live Commission Rate"
          onChange={(e) => setTeacherProps({ commissionLive: Number(e.target.value) })}
        />

        <Button
          variant="contained"
          onClick={onSave}
          disabled={busy}
        >
          Add Teacher
        </Button>

      </form>
      <ListItems list={teachers} />
    </>
  );
};
