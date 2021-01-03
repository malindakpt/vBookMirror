import React, { useState, useContext, useEffect } from 'react';
import {
  TextField, Button,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, Entity, getDocsWithProps } from '../../../../data/Store';
import { AppContext } from '../../../../App';
import { IExam } from '../../../../interfaces/IExam';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { ListItems } from '../../../presentational/ListItems/ListItemsComponent';
import { useForcedUpdate } from '../../../../hooks/useForcedUpdate';

export const AddExam = () => {
  useBreadcrumb();

  const [busy, setBusy] = useState<boolean>(false);

  const [exam, setExam] = useState<IExam>();
  const [exams, setExams] = useState<IExam[]>([]);
  const { showSnackbar } = useContext(AppContext);
  const [onUpdate, updateUI] = useForcedUpdate();

  const setExamProps = (obj: any) => {
    setExam((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  useEffect(() => {
    getDocsWithProps<IExam[]>(Entity.EXAMS, {}).then((data) => data && setExams(data));
  }, [onUpdate]);

  const onSave = () => {
    if (!exam?.type || !exam.name) {
      showSnackbar('Invalid inputs');
      return;
    }

    setBusy(true);
    if (exam) {
      addDoc(Entity.EXAMS, exam).then(() => {
        showSnackbar('Exam added');
        updateUI();
        setBusy(false);
      });
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
          id="examName"
          label="Exam Name"
          onChange={(e) => setExamProps({ name: e.target.value })}
        />

        <TextField
          className={classes.input}
          id="type"
          label="Type Theory/Revision"
          onChange={(e) => setExamProps({ type: e.target.value })}
        />

        <Button
          variant="contained"
          onClick={onSave}
          disabled={busy}
        >
          Add Examination
        </Button>
      </form>
      <ListItems list={exams} />
    </>
  );
};
