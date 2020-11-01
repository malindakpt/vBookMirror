import {
  Button, Divider, FormControl, FormControlLabel, InputLabel,
  List, ListItem, MenuItem, Radio, RadioGroup, Select, TextField,
} from '@material-ui/core';
import React, { useEffect, useState, useContext } from 'react';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import StopIcon from '@material-ui/icons/Stop';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../../../App';
import {
  addDoc, Entity, getDocsWithProps, getDocWithId, updateDoc,
} from '../../../../data/Store';
import { getObject } from '../../../../data/StoreHelper';
import { formattedTime } from '../../../../helper/util';
import { ICourse } from '../../../../interfaces/ICourse';
import { IExam } from '../../../../interfaces/IExam';
import { ILiveLesson, LiveMeetingStatus } from '../../../../interfaces/ILesson';
import { ISubject } from '../../../../interfaces/ISubject';
import { ITeacher } from '../../../../interfaces/ITeacher';
import classes from './AddLiveLesson.module.scss';
import Config from '../../../../data/Config';

export enum JOIN_MODES {
  ONLY_AKSHARA,
  AKSHARA_LK_AND_APP,
  ONLY_APP
}
export const joinModes = [
  [JOIN_MODES.ONLY_AKSHARA, 'Web Only'],
  [JOIN_MODES.AKSHARA_LK_AND_APP, 'Web or Installed App'],
  [JOIN_MODES.ONLY_APP, 'Installed App Only'],
];

const fresh: ILiveLesson = {
  id: '',
  topic: '',
  description: '',
  duration: 2,
  keywords: '',
  attachments: [],
  courseId: '',
  price: 0,
  ownerEmail: '',
  dateTime: new Date().getTime(),
  status: LiveMeetingStatus.NOT_STARTED,
  subCount: 0,
};
export const AddLiveLesson = () => {
  const history = useHistory();
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
  const [zoomJoinMode, setZoomJoinMode] = useState<number>(0);

  const disabled = busy || !selectedCourse;

  const setSessionProps = (obj: any) => {
    setLiveLesson((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  useEffect(() => {
    // fetch unrelated data
    if (email) {
      getDocWithId<ITeacher>(Entity.TEACHERS, email).then((teacher) => {
        if (teacher) {
          setZoomMeetingId(teacher.zoomMeetingId ?? '');
          setZoomPwd(teacher.zoomPwd ?? '');
          setZoomMaxCount(teacher.zoomMaxCount ?? 100);
          setZoomJoinMode(teacher.zoomJoinMode ?? JOIN_MODES.AKSHARA_LK_AND_APP);
          setTeacher(teacher);
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
    if (selectedCourse) { setSessionProps({ courseId: selectedCourse.id }); }
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
      updateDoc(Entity.TEACHERS, teacher.id, {
        ...teacher, zoomMeetingId, zoomPwd, zoomMaxCount, zoomJoinMode,
      }).then((data) => {
        showSnackbar('Changed Credentials');
        getDocWithId<ITeacher>(Entity.TEACHERS, email).then((data) => data && setTeacher(data));
        setBusy(false);
        addNew();
      });
    }
  };

  const startMeeting = (less: ILiveLesson) => {
    setBusy(true);
    if (teacher && email) {
      const lesId = teacher?.zoomRunningLessonId === less.id ? '' : less.id;
      updateDoc(Entity.TEACHERS, teacher.id, { ...teacher, zoomRunningLessonId: lesId }).then((data) => {
        showSnackbar(`${less.topic} ${lesId ? 'Started' : 'Stopped'}`);
        getDocWithId<ITeacher>(Entity.TEACHERS, email).then((data) => data && setTeacher(data));
        setBusy(false);
        if (lesId) {
          history.push('/liveStat/'+lesId);
          window.open(`https://us04web.zoom.us/j/${zoomMeetingId}?pwd=${zoomPwd}`, '_blank');
        }
      });
    }
  };

  const copyLessonURL = (lessonId: string) => {
    if (teacher && selectedCourse) {
      const copyText: any = document.getElementById('copyInput');

      if (copyText) {
        const link = `${window.location.host}/teacher/${teacher.url}/${selectedCourse.id}/live/${lessonId}`;
        copyText.value = link;
        copyText.select();
        // copyText.setSelectionRange(0, 99999);
        document.execCommand('copy');
        showSnackbar(`Lesson URL copied! ${link}`);
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
              disabled={disabled}
            />
            <FormControlLabel
              value
              control={<Radio />}
              label="Edit lesson"
              disabled={disabled}
            />
          </RadioGroup>

          <TextField
            className={classes.input}
            id="topic"
            label="Topic"
            disabled={disabled}
            value={liveLesson.topic}
            onChange={(e) => setSessionProps({ topic: e.target.value })}
          />

          <TextField
            className={classes.input}
            id="desc"
            label="Description"
            disabled={disabled}
            value={liveLesson.description}
            onChange={(e) => setSessionProps({ description: e.target.value })}
          />

          <TextField
            className={classes.input}
            id="price"
            label="Price"
            type="number"
            disabled={disabled || Config.paymentDisabled}
            value={liveLesson.price}
            onChange={(e) => setSessionProps({ price: Number(e.target.value) })}
          />

          <TextField
            className={classes.input}
            id="duration"
            label="Duration in Hours(Lesson will not be visible to students after the duration)"
            type="number"
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
              disabled={disabled}
            >
              {editMode ? 'Save Changes' : 'Add Live Lesson'}
            </Button>
            <input
              type="text"
              value=""
              onChange={() => {}}
              id="copyInput"
              style={{ width: '1px' }}
            />
          </div>

        </form>
        <div>
          <div className={classes.meetInfo}>
            <TextField
              className={classes.input2}
              id="mid"
              label="Meeting Id"
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

            <FormControl className={classes.input}>
              <InputLabel
                id="demo-simple-select-label"
                className="fc1"
              >
                Join Mode
              </InputLabel>
              <Select
                className={`${classes.input} fc1`}
                labelId="label1"
                id="id1"
                value={zoomJoinMode}
                disabled={busy}
                onChange={(e) => setZoomJoinMode(e.target.value as number)}
              >
                {joinModes.map((mode) => (
                  <MenuItem
                    value={mode[0]}
                    key={mode[0]}
                  >
                    {mode[1]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              // variant="contained"
              color="primary"
              onClick={saveAuth}
              disabled={busy}
              style={{ gridColumn: '2/4' }}
            >
              Change Zoom Config
            </Button>
          </div>
          <List
            component="nav"
            aria-label="main mailbox folders"
          >
            {
              liveLessons.sort((a, b) => a.dateTime - b.dateTime).map((liveLesson) => (
                <div
                  key={liveLesson.id}
                >
                  <ListItem
                    button
                    onClick={() => { setEditMode(true); editLesson(liveLesson); }}
                  >

                    {teacher?.zoomRunningLessonId === liveLesson.id ? (
                      <StopIcon onClick={(e) => {
                        startMeeting(liveLesson); e.stopPropagation();
                      }}
                      />
                      ) : (
                        <PlayCircleOutlineIcon
                          className={classes.play}
                          onClick={(e) => {
                            startMeeting(liveLesson); e.stopPropagation();
                          }}
                        />
                      )}

                    <div
                      className={teacher?.zoomRunningLessonId === liveLesson.id ? classes.running : ''}
                      style={{ fontSize: '11px', width: '100%' }}
                    >
                      {`${new Date(liveLesson.dateTime).toString().split('GMT')[0]} : ${liveLesson.topic}`}
                    </div>
                    <FileCopyIcon onClick={(e) => {
                      copyLessonURL(liveLesson.id); e.stopPropagation();
                    }}
                    />
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
