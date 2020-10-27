import {
  Button, Divider, FormControl, InputLabel, List, ListItem, MenuItem, Select, TextField,
} from '@material-ui/core';
import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../../App';
import { addDoc, Entity, getDocsWithProps } from '../../../../data/Store';
import { getObject } from '../../../../data/StoreHelper';
import { ICourse } from '../../../../interfaces/ICourse';
import { IExam } from '../../../../interfaces/IExam';
import { ILesson, ILiveLesson } from '../../../../interfaces/ILesson';
import { ISubject } from '../../../../interfaces/ISubject';
import classes from './AddLiveSession.module.scss';

export const AddLiveSession = () => {
  const { showSnackbar, email } = useContext(AppContext);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [busy, setBusy] = useState<boolean>(false);
  const [session, setSession] = useState<ILiveLesson>({
    id: '',
    topic: '',
    description: '',
    duration: 0,
    keywords: '',
    attachments: [],
    courseId: '',
    price: 0,
    ownerEmail: '',
    meetingId: '',
    dateTime: new Date().getTime(),
    pwd: '',
  });
  const [sessions, setSessions] = useState<ILiveLesson[]>([]);

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ICourse>();

  const [attachments, setAttachments] = useState<string[]>([]);

  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  const setSessionProps = (obj: any) => {
    setSession((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  const onSave = () => {
    setBusy(true);
    addDoc(Entity.LESSONS_LIVE, { ...session, ownerEmail: email }).then((data) => {
      showSnackbar('Live Session Added');
      getDocsWithProps<ILiveLesson[]>(Entity.LESSONS_LIVE, {}).then((data) => setSessions(data));
      setBusy(false);
    });
  };

  useEffect(() => {
    // fetch unrelated data
    getDocsWithProps<ISubject[]>(Entity.SUBJECTS, {}).then((data) => setSubjects(data));
    getDocsWithProps<IExam[]>(Entity.EXAMS, {}).then((data) => setExams(data));
    getDocsWithProps<ICourse[]>(Entity.COURSES, { ownerEmail: email })
      .then((data) => data && setCourses(data));
  }, []);

  const onCourseChange = (id: string) => {
    setSessionProps({ courseId: id });
    setSelectedCourse(courses.find((c) => c.id === id));
    getDocsWithProps<ILiveLesson[]>(Entity.LESSONS_LIVE, { ownerEmail: email, courseId: id })
      .then((data) => data && setSessions(data));
  };

  const copyLesson = (sess: ILiveLesson) => {
    setSessionProps(sess);
  };

  return (
    <>
      <div
        className={classes.root}
      >
        <form
          noValidate
          autoComplete="off"
          className={classes.editor}
        >
          <FormControl className={classes.input}>
            <InputLabel
              id="demo-simple-select-label"
              className="fc1"
            >
              Select Course
            </InputLabel>
            <Select
              className={`${classes.input} fc1`}
              labelId="label1"
              id="id1"
              value={selectedCourse}
              disabled={busy}
              onChange={(e) => onCourseChange(e.target.value as string)}
            >
              {courses.map((course) => {
                const subject = getObject(subjects, course.subjectId);
                const exam = getObject(exams, course.examId);

                return (
                  <MenuItem
                    value={course.id}
                    key={course.id}
                  >
                    {`${exam?.name}-${exam?.type}-${subject?.name}`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <TextField
            className={classes.input}
            id="topic"
            label="Topic"
            value={session?.topic}
            onChange={(e) => setSessionProps({ topic: e.target.value })}
          />

          <TextField
            className={classes.input}
            id="desc"
            label="Description"
            onChange={(e) => setSessionProps({ description: e.target.value })}
          />

          <TextField
            className={classes.input}
            id="price"
            label="Price"
            type="number"
            onChange={(e) => setSessionProps({ price: e.target.value })}
          />

          <TextField
            className={classes.input}
            id="duration"
            label="Duration"
            onChange={(e) => setSessionProps({ duration: e.target.value })}
          />

          <TextField
            className={classes.inputMulti}
            id="standard-multiline-static"
            label="Add GoogleDrive links as separate lines"
            multiline
            rows={3}
            variant="outlined"
            disabled={busy}
            value={attachments.reduce((a, b) => (a !== '' ? `${a}\n${b}` : `${b}`), '')}
            onChange={(e) => {
              console.log(e.target.value);
              setAttachments(e.target.value.split('\n'));
            }}
          />

          <TextField
            id="datetime-local"
            label="Date and Time"
            type="datetime-local"
            onChange={(e) => setSessionProps({ dateTime: new Date(e.target.value).getTime() })}
            // defaultValue="2017-05-24T10:30"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={onSave}
              disabled={busy}
            >
              {editMode ? 'Edit Live Lesson' : 'Add Live Lesson'}
            </Button>
          </div>
        </form>
        <div>
          <List
            component="nav"
            aria-label="main mailbox folders"
          >
            {
              sessions.map((ses) => (
                <div
                // c.id becomes undefined for newly added lesson since we refer that from local
                  key={ses.id}
                >
                  <ListItem
                    button
                    onClick={() => { setEditMode(true); copyLesson(ses); }}
                  >
                    <div
                      className="fc1"
                      style={{ fontSize: '11px', width: '100%' }}
                    >
                      {`${new Date(ses.dateTime).toUTCString().split('GMT')[0]} : ${ses.topic}`}
                    </div>

                  </ListItem>
                  <Divider />
                </div>
              ))
            }
          </List>
        </div>
      </div>

    </>
  );
};
