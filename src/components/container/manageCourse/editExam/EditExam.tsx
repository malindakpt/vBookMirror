import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Select, MenuItem, InputLabel, FormControl, FormControlLabel, Checkbox,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { Entity, getDocsWithProps, updateDoc } from '../../../../data/Store';
import { getObject } from '../../../../data/StoreHelper';
import { AppContext } from '../../../../App';
import { IExam } from '../../../../interfaces/IExam';
import { ISubject } from '../../../../interfaces/ISubject';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';

export const EditExam = () => {
  useBreadcrumb();
  const [busy, setBusy] = useState<boolean>(false);

  const { showSnackbar } = useContext(AppContext);
  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [selectedExamIdx, setSelectedExamIdx] = useState<number>(-1);

  useEffect(() => {
    getDocsWithProps<IExam>(Entity.EXAMS, {}).then((data) => setExams(data));
    getDocsWithProps<ISubject>(Entity.SUBJECTS, {}).then((data) => setSubjects(data));
  }, []);

  const onSelectedExamChange = (e: any) => {
    setSelectedExamIdx(e.target.value);
  };

  const setSubjectIds = (subjIds: string[]) => {
    setExams((prev) => {
      const next = [...prev];
      next[selectedExamIdx].subjectIds = subjIds;
      return next;
    });
  };

  const onSubjectChange = (e: any) => {
    const { id: subjectId, checked } = e.target;
    const subjecList = exams[selectedExamIdx].subjectIds ?? [];
    const exists = subjecList.findIndex((id) => id === subjectId);

    if (checked) {
      if (exists === -1) {
        setSubjectIds([subjectId, ...subjecList]);
      }
    } else if (exists >= 0) {
      subjecList.splice(exists, 1);
      setSubjectIds(subjecList);
    }
  };

  const onSave = () => {
    setBusy(true);
    updateDoc(Entity.EXAMS, exams[selectedExamIdx].id, { subjectIds: exams[selectedExamIdx].subjectIds })
      .then(() => {
        showSnackbar('Exam is updated');
        setBusy(false);
      });
  };

  const disabled = selectedExamIdx < 0;

  return (
    <>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <FormControl className={classes.input}>
          <InputLabel id="demo-simple-select-label">Select Exam</InputLabel>
          <Select
            className={classes.input}
            labelId="label1"
            id="id1"
            value={selectedExamIdx >= 0 ? selectedExamIdx : ''}
            onChange={onSelectedExamChange}
          >
            {exams?.map((exam, idx) => (
              <MenuItem
                value={idx}
                key={exam.id}
              >
                {`${exam.name} ${exam.type}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className={classes.twoColumn}>
          {selectedExamIdx !== -1 && subjects?.map((subject) => (
            <FormControlLabel
              key={subject.id}
              control={(
                <Checkbox
                  id={subject.id}
                  checked={(exams[selectedExamIdx].subjectIds ?? [])?.includes(subject.id)}
                  onChange={onSubjectChange}
                  name="checkedB"
                  color="primary"
                />
        )}
              label={getObject(subjects, subject.id)?.name}
            />
          ))}
        </div>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={disabled || busy}
        >
          Edit Exam Changes
        </Button>
      </form>
    </>
  );
};
