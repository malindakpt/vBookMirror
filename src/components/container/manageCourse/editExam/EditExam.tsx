import React, { useState, useEffect } from 'react';
import {
  Button, Select, MenuItem, InputLabel, FormControl, FormControlLabel, Checkbox,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { getDocsWithProps, updateDoc } from '../../../../data/Store';
import { IExam, ISubject } from '../../../../data/Interfaces';
import { getSubject } from '../../../../data/StoreHelper';

export const EditExam = () => {
  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [selectedExamIdx, setSelectedExamIdx] = useState<number>(-1);

  useEffect(() => {
    getDocsWithProps('exams', {}, {}).then((data:IExam[]) => setExams(data));
    getDocsWithProps('subjects', {}, {}).then((data:IExam[]) => setSubjects(data));
  }, []);

  const onSelectedExamChange = (e: any) => {
    console.log(exams);
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
    console.log(exams);
    updateDoc('exams', exams[selectedExamIdx].id, { subjectIds: exams[selectedExamIdx].subjectIds });
  };

  return (
    <>
      <h3>Edit Exam</h3>
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
                {`${exam.name} ${exam.batch} ${exam.type}`}
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
              label={getSubject(subjects, subject.id)?.name}
            />
          ))}
        </div>
        <Button
          variant="contained"
          onClick={onSave}
        >
          Save
        </Button>
      </form>
    </>
  );
};
