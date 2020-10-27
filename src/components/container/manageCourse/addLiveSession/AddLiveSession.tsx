import {
  Button, Divider, FormControl, FormControlLabel, InputLabel, List, ListItem, MenuItem, Radio, RadioGroup, Select, TextField,
} from '@material-ui/core';
import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../../App';
import {
  addDoc, Entity, getDocsWithProps, getDocWithId, updateDoc,
} from '../../../../data/Store';
import { getObject } from '../../../../data/StoreHelper';
import { formattedTime } from '../../../../helper/util';
import { ICourse } from '../../../../interfaces/ICourse';
import { IExam } from '../../../../interfaces/IExam';
import { ILiveLesson } from '../../../../interfaces/ILesson';
import { ISubject } from '../../../../interfaces/ISubject';
import { ITeacher } from '../../../../interfaces/ITeacher';
import classes from './AddLiveSession.module.scss';

const fresh = {
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
};
export const AddLiveSession = () => {
  const { showSnackbar, email } = useContext(AppContext);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [busy, setBusy] = useState<boolean>(false);
  const [session, setSession] = useState<ILiveLesson>(fresh);
  const [sessions, setSessions] = useState<ILiveLesson[]>([]);

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ICourse>();

  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [teacher, setTeacher] = useState<ITeacher>();

  const [zoomMeetingId, setZoomMeetingId] = useState<string>('');
  const [zoomPwd, setZoomPwd] = useState<string>('');

  const setSessionProps = (obj: any) => {
    setSession((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  useEffect(() => {
    // fetch unrelated data
    if (email) {
      getDocWithId<ITeacher>(Entity.TEACHERS, email).then((data) => {
        if (data) {
          setZoomMeetingId(data.zoomMeetingId);
          setZoomPwd(data.zoomPwd);
          setTeacher(data);
        }
      });
      getDocsWithProps<ISubject[]>(Entity.SUBJECTS, {}).then((data) => setSubjects(data));
      getDocsWithProps<IExam[]>(Entity.EXAMS, {}).then((data) => setExams(data));
      getDocsWithProps<ICourse[]>(Entity.COURSES, { ownerEmail: email })
        .then((data) => data && setCourses(data));
    }
  }, [email]);

  const onCourseChange = (id: string) => {
    setSessionProps({ courseId: id });
    setSelectedCourse(courses.find((c) => c.id === id));
    getDocsWithProps<ILiveLesson[]>(Entity.LESSONS_LIVE, { ownerEmail: email, courseId: id })
      .then((data) => data && setSessions(data));
  };

  const editLesson = (sess: ILiveLesson) => {
    setSessionProps(sess);
    setEditMode(true);
  };

  const addNew = () => {
    setSessionProps(fresh);
    setEditMode(false);
  };

  const onSave = () => {
    setBusy(true);

    if (editMode) {
      updateDoc(Entity.LESSONS_LIVE, session.id, session).then((data) => {
        showSnackbar('Live Session Edited');
        getDocsWithProps<ILiveLesson[]>(Entity.LESSONS_LIVE, { courseId: selectedCourse?.id }).then((data) => setSessions(data));
        setBusy(false);
        addNew();
      });
    } else {
      addDoc(Entity.LESSONS_LIVE, { ...session, ownerEmail: email }).then((data) => {
        showSnackbar('Live Session Added');
        getDocsWithProps<ILiveLesson[]>(Entity.LESSONS_LIVE, { courseId: selectedCourse?.id }).then((data) => setSessions(data));
        setBusy(false);
        addNew();
      });
    }
  };

  const saveAuth = () => {
    setBusy(true);
    if (teacher && email) {
      updateDoc(Entity.TEACHERS, teacher.id, { ...teacher, zoomMeetingId, zoomPwd }).then((data) => {
        showSnackbar('Changed Credentials');
        getDocWithId<ITeacher>(Entity.TEACHERS, email).then((data) => data && setTeacher(data));
        setBusy(false);
        addNew();
      });
    }
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
          <RadioGroup
            className={classes.twoColumn}
            aria-label="editMode"
            name="editMode"
            value={editMode}
            onChange={(e: any) => {
              if (e.target.value === 'false') {
                addNew();
              } else {
                showSnackbar('Select a lesson from the lessons list');
              }
            }}
          >
            <FormControlLabel
              value={false}
              control={<Radio />}
              label="Add New Lesson"
              disabled={busy}
            />
            <FormControlLabel
              value
              control={<Radio />}
              label="Edit lesson"
              disabled={busy}
            />
          </RadioGroup>
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
              value={selectedCourse?.id ?? ''}
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
            value={session.topic}
            onChange={(e) => setSessionProps({ topic: e.target.value })}
          />

          <TextField
            className={classes.input}
            id="desc"
            label="Description"
            value={session.description}
            onChange={(e) => setSessionProps({ description: e.target.value })}
          />

          <TextField
            className={classes.input}
            id="price"
            label="Price"
            type="number"
            value={session.price}
            onChange={(e) => setSessionProps({ price: e.target.value })}
          />

          <TextField
            className={classes.input}
            id="duration"
            label="Duration"
            value={session.duration}
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
            value={session.attachments.reduce((a, b) => (a !== '' ? `${a}\n${b}` : `${b}`), '')}
            onChange={(e) => {
              console.log(e.target.value);
              setSessionProps({ attachments: e.target.value.split('\n') });
            }}
          />

          <TextField
            id="datetime-local"
            label="Date and Time"
            type="datetime-local"
            value={formattedTime(new Date(session?.dateTime ?? new Date().getTime()))}
            onChange={(e) => {
              console.log(e.target.value);
              setSessionProps({ dateTime: new Date(e.target.value).getTime() });
            }}
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
          <div className={classes.meetInfo}>
            <TextField
              className={classes.input2}
              id="mid"
              label="Zoom Meeting Id"
              disabled={!teacher}
              value={zoomMeetingId}
              onChange={(e) => setZoomMeetingId(e.target.value)}
            />

            <TextField
              className={classes.input2}
              id="pwd"
              label="Password"
              disabled={!teacher}
              value={zoomPwd}
              onChange={(e) => setZoomPwd(e.target.value)}
            />
            <div />
            <Button
              color="primary"
              onClick={saveAuth}
              disabled={busy}
            >
              Save Auth
            </Button>
          </div>
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
                    onClick={() => { setEditMode(true); editLesson(ses); }}
                  >
                    <div
                      className="fc1"
                      style={{ fontSize: '11px', width: '100%' }}
                    >
                      {`${new Date(ses.dateTime).toString().split('GMT')[0]} : ${ses.topic}`}
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
