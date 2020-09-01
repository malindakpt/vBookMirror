import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl, FormControlLabel, Checkbox,
} from '@material-ui/core';
import classes from '../ManageCourse.module.scss';
import { addDoc, getDocsWithProps, updateDoc } from '../../../../data/Store';
import {
  ILesson, ICourse, ITeacher, IExam, ISubject,
} from '../../../../meta/Interfaces';
import {
  getCourses, getSubject, getExam, getSubjectFromSubjects,
} from '../../../../meta/DataHandler';

export const EditExam = () => {
  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  // const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [selectedExamIdx, setSelectedExamIdx] = useState<number>(-1);

  useEffect(() => {
    getDocsWithProps('exams', {}, {}).then((data:IExam[]) => setExams(data));
    getDocsWithProps('subjects', {}, {}).then((data:IExam[]) => setSubjects(data));
  }, []);

  const onSelectedExamChange = (e: any) => {
    // getDocsWithProps('exams', {}, {}).then((data:IExam[]) => setExams(data));
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
    const exists = exams[selectedExamIdx].subjectIds.findIndex((id) => id === subjectId);

    if (checked) {
      if (exists === -1) {
        // setSelectedSubjectIds((prev) => [id, ...prev]);
        setSubjectIds([subjectId, ...exams[selectedExamIdx].subjectIds]);
      }
    } else if (exists >= 0) {
      // setSelectedSubjectIds((prev) => {
      //   const next = [...prev];
      //   next.splice(exists, 1);
      //   return next;
      // });
      exams[selectedExamIdx].subjectIds.splice(exists, 1);
      setSubjectIds(exams[selectedExamIdx].subjectIds);
    }
  };

  const onSave = () => {
    console.log(exams);
    updateDoc('exams', exams[selectedExamIdx].id, { subjectIds: exams[selectedExamIdx].subjectIds });
    // setExams((prev) => {
    //   const next = [...prev];
    //   next[selectedExamIdx].subjectIds = selectedSubjectIds;
    //   console.log(next);
    //   updateDoc('exams', next[selectedExamIdx].id, { subjectIds: selectedSubjectIds });
    //   return next;
    // });
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
                {`${exam.name}`}
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
                  checked={exams[selectedExamIdx].subjectIds.includes(subject.id)}
                  onChange={onSubjectChange}
                  name="checkedB"
                  color="primary"
                />
        )}
              label={getSubjectFromSubjects(subjects, subject.id)?.id}
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
