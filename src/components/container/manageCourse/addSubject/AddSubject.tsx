import React, { useState, useContext, useEffect } from 'react';
import {
  TextField, Button,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, Entity, getDocsWithProps } from '../../../../data/Store';
import { AppContext } from '../../../../App';
import { ListItems } from '../../../presentational/ListItems/ListItemsComponent';
import { useForcedUpdate } from '../../../../hooks/useForcedUpdate';
import { ISubject } from '../../../../interfaces/ISubject';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';

export const AddSubject = () => {
  useBreadcrumb();
  const [busy, setBusy] = useState<boolean>(false);
  const [onUpdate, updateUI] = useForcedUpdate();
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
    getDocsWithProps<ISubject>(Entity.SUBJECTS, {}).then((data) => setSubjects(data));
    // eslint-disable-next-line
  },[onUpdate])

  const onSave = () => {
    setBusy(true);
    addDoc(Entity.SUBJECTS, subject).then(() => {
      showSnackbar('Subject added');
      updateUI();
      setBusy(false);
    });
  };

  const disabled: boolean = (subject?.name.length ?? 0) < 2;

  return (
    <>
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
          disabled={disabled || busy}
        >
          Add Subject
        </Button>
      </form>
      <ListItems list={subjects} />
    </>
  );
};
