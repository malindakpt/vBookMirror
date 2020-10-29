import {
  Button, Divider, FormControl, FormControlLabel, InputLabel,
  List, ListItem, MenuItem, Radio, RadioGroup, Select, TextField,
} from '@material-ui/core';
import React, { useEffect, useState, useContext } from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { AppContext } from '../../../../App';
import {
  addDoc, deleteDoc, Entity, getDocsWithProps, getDocWithId, updateDoc,
} from '../../../../data/Store';
import { getObject } from '../../../../data/StoreHelper';
import { formattedTime } from '../../../../helper/util';
import { ICourse } from '../../../../interfaces/ICourse';
import { IExam } from '../../../../interfaces/IExam';
import { ILiveLesson, LiveMeetingStatus } from '../../../../interfaces/ILesson';
import { ISubject } from '../../../../interfaces/ISubject';
import { ITeacher } from '../../../../interfaces/ITeacher';
import classes from './AddLiveSession.module.scss';

const fresh = {
  id: '',
  topic: '',
  description: '',
  duration: 2,
  keywords: '',
  attachments: [],
  courseId: '',
  price: 0,
  ownerEmail: '',
  meetingId: '',
  dateTime: new Date().getTime(),
  pwd: '',
  status: LiveMeetingStatus.NOT_STARTED,
};
export const AddLiveSession = () => {
  const { showSnackbar, email } = useContext(AppContext);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [busy, setBusy] = useState<boolean>(false);
  const [liveLesson, setLiveLesson] = useState<ILiveLesson>(fresh);
  const [liveLessons, setLiveLessons] = useState<ILiveLesson[]>([]);

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ICourse>();

  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [teacher, setTeacher] = useState<ITeacher>();

  const [zoomMeetingId, setZoomMeetingId] = useState<string>('');
  const [zoomPwd, setZoomPwd] = useState<string>('');
  const [zoomMaxCount, setZoomMaxCount] = useState<number>(100);

  const setSessionProps = (obj: any) => {
    setLiveLesson((prev) => {
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
      .then((data) => data && setLiveLessons(data));
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
    if (liveLesson.topic.length < 5 || liveLesson.description.length < 5) {
      showSnackbar('Topic and description should be more than 5 charactors');
      return;
    }

    setBusy(true);
    if (editMode) {
      updateDoc(Entity.LESSONS_LIVE, liveLesson.id, liveLesson).then((data) => {
        showSnackbar('Live Session Edited');
        getDocsWithProps<ILiveLesson[]>(Entity.LESSONS_LIVE,
          { courseId: selectedCourse?.id }).then((data) => setLiveLessons(data));
        setBusy(false);
        addNew();
      });
    } else {
      addDoc(Entity.LESSONS_LIVE, { ...liveLesson, ownerEmail: email }).then((data) => {
        showSnackbar('Live Session Added');
        getDocsWithProps<ILiveLesson[]>(Entity.LESSONS_LIVE,
          { courseId: selectedCourse?.id }).then((data) => setLiveLessons(data));
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

  const startMeeting = (less: ILiveLesson) => {
    setBusy(true);
    if (teacher && email && editMode) {
      const lesId = teacher?.zoomRunningLessonId === less.id ? '' : less.id;
      updateDoc(Entity.TEACHERS, teacher.id, { ...teacher, zoomRunningLessonId: lesId }).then((data) => {
        showSnackbar(`${less.topic} started`);
        getDocWithId<ITeacher>(Entity.TEACHERS, email).then((data) => data && setTeacher(data));
        setBusy(false);
        // addNew();
      });
    }
  };

  const deleteLesson = (lesson: ILiveLesson) => {
    if (selectedCourse) {
      if ((lesson.dateTime + 24 * 60 * 60 * 1000) < (new Date().getTime())) {
        setBusy(true);
        deleteDoc(Entity.LESSONS_LIVE, lesson.id).then(() => {
          setBusy(true);
          getDocsWithProps<ILiveLesson[]>(Entity.LESSONS_LIVE, {
            ownerEmail: email,
            courseId: selectedCourse.id,
          })
            .then((data) => {
              data && setLiveLessons(data);
              setBusy(false);
              showSnackbar('Lesson Deleted');
            });
        });
      } else {
        showSnackbar('You can delete lessons after 24 hours of start time');
      }
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

          <TextField
            className={classes.input}
            id="topic"
            label="Topic"
            value={liveLesson.topic}
            onChange={(e) => setSessionProps({ topic: e.target.value })}
          />

          <TextField
            className={classes.input}
            id="desc"
            label="Description"
            value={liveLesson.description}
            onChange={(e) => setSessionProps({ description: e.target.value })}
          />

          <TextField
            className={classes.input}
            id="price"
            label="Price"
            type="number"
            value={liveLesson.price}
            onChange={(e) => setSessionProps({ price: Number(e.target.value) })}
          />

          <TextField
            className={classes.input}
            id="duration"
            label="Duration in Hours(Lesson will not be visble to students after the duration)"
            type="number"
            value={liveLesson.duration}
            onChange={(e) => setSessionProps({ duration: Number(e.target.value) })}
          />

          <TextField
            className={classes.inputMulti}
            id="standard-multiline-static"
            label="Add GoogleDrive links as separate lines"
            multiline
            rows={3}
            variant="outlined"
            disabled={busy}
            value={liveLesson.attachments.reduce((a, b) => (a !== '' ? `${a}\n${b}` : `${b}`), '')}
            onChange={(e) => {
              console.log(e.target.value);
              setSessionProps({ attachments: e.target.value.split('\n') });
            }}
          />

          <TextField
            id="datetime-local"
            label="Date and Time"
            type="datetime-local"
            value={formattedTime(new Date(liveLesson?.dateTime ?? new Date().getTime()))}
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
              disabled={busy || !selectedCourse}
            >
              {editMode ? 'Save Changes' : 'Add Live Lesson'}
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

            <TextField
              className={classes.input2}
              id="max"
              label="Max Students"
              disabled={!teacher}
              value={zoomMaxCount}
              onChange={(e) => setZoomMaxCount(Number(e.target.value))}
            />
            <Button
              color="primary"
              onClick={() => startMeeting(liveLesson)}
              disabled={busy || !editMode}
            >
              {teacher?.zoomRunningLessonId === liveLesson.id ? 'Finish Meeting' : 'Start Meeting'}
            </Button>
            <Button
              color="primary"
              onClick={saveAuth}
              disabled={busy}
            >
              Save Meet Info
            </Button>
          </div>
          <List
            component="nav"
            aria-label="main mailbox folders"
          >
            {
              liveLessons.sort((a, b) => a.dateTime - b.dateTime).map((ses) => (
                <div
                  key={ses.id}
                >
                  <ListItem
                    button
                    onClick={() => { setEditMode(true); editLesson(ses); }}
                  >

                    <DeleteForeverIcon onClick={(e) => {
                      deleteLesson(ses); e.stopPropagation();
                    }}
                    />
                    <div
                      className={teacher?.zoomRunningLessonId === ses.id ? classes.running : ''}
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
