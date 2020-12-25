import React, {
  useState, useEffect, useContext, useCallback,
} from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl,
  RadioGroup, FormControlLabel, Radio, List, ListItem, ListItemText, Divider,
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SaveIcon from '@material-ui/icons/Save';
import classes from './AddVideoLesson.module.scss';
import {
  addDoc, Entity, getDocsWithProps, getDocWithId, updateDoc,
} from '../../../../data/Store';
import { getObject } from '../../../../data/StoreHelper';
import { AppContext } from '../../../../App';
import {
  IVideoLesson, LessonType, VideoType, VideoUrlsObj,
} from '../../../../interfaces/ILesson';
import { ICourse } from '../../../../interfaces/ICourse';
import { IExam } from '../../../../interfaces/IExam';
import { ISubject } from '../../../../interfaces/ISubject';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { useForcedUpdate } from '../../../../hooks/useForcedUpdate';
import Config, {
  AKSHARA_HELP_VIDEO, OBS_DOWNLOAD, OBS_HELP_VIDEO,
} from '../../../../data/Config';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { AddVideo } from '../../../presentational/addVideo/AddVideo';

export const AddVideoLesson = () => {
  useBreadcrumb();
  const [busy, setBusy] = useState<boolean>(false);
  const [onDataFetch, fetchData] = useForcedUpdate();
  const { showSnackbar, email } = useContext(AppContext);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [courseOrderChanged, setCourseOrderChaged] = useState<boolean>(false);

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [courseId, setCourseId] = useState<string>('');
  const [teacher, setTeacher] = useState<ITeacher>();

  const [courseLessons, setCourseLessons] = useState<IVideoLesson[]>([]);

  const getNewLesson = (courseId: string): IVideoLesson => ({
    topic: '',
    description: '',

    duration: 0,
    keywords: '',
    attachments: [],
    courseId,
    price: 0,
    ownerEmail: email ?? '',

    type: LessonType.VIDEO,
    videoUrls: {
      activeVideo: VideoType.None,
      googleDrive: '',
      mediaFire: '',
    },

    createdAt: 0,
    id: '',
    updatedAt: 0,
    orderIndex: 0,
  });

  const [selectedLesson, setSelectedLesson] = useState<IVideoLesson>(getNewLesson(courseId));

  const handleChange = (obj: Record<string, any>) => {
    setSelectedLesson((prev) => {
      const clone = { ...prev, ...obj };
      return clone;
    });
  };

  // Replicate changes of here for all #LessonModify
  const addNew = (courseId: string) => {
    setSelectedLesson(getNewLesson(courseId));
  };

  const onCourseChange = (_courseId: string) => {
    setCourseId(_courseId);

    getDocsWithProps<IVideoLesson[]>(Entity.LESSONS_VIDEO,
      { ownerEmail: email, courseId: _courseId }).then((lessons) => {
      setCourseLessons(lessons);
      addNew(_courseId);
    });
  };

  useEffect(() => {
    if (!email) return;
    // fetch unrelated data
    getDocsWithProps<ICourse[]>(Entity.COURSES, { ownerEmail: email }).then((data) => setCourses(data));
    getDocsWithProps<ISubject[]>(Entity.SUBJECTS, {}).then((data) => setSubjects(data));
    getDocsWithProps<IExam[]>(Entity.EXAMS, {}).then((data) => setExams(data));
    getDocWithId<ITeacher>(Entity.TEACHERS, email).then((data) => data && setTeacher(data));
    // eslint-disable-next-line
  }, [onDataFetch]);

  const disabled = !courseId || busy;

  const validateLesson = (): boolean => {
    if (!selectedLesson.topic || selectedLesson.topic.length < 5) {
      showSnackbar('Topic should have minimum length of 5');
      return false;
    }
    if (!selectedLesson.description || selectedLesson.description.length < 5) {
      showSnackbar('Description should have minimum length of 5');
      return false;
    }
    if (selectedLesson.price > 0 && selectedLesson.price < 50) {
      showSnackbar('Price can be 0 or more than 50');
      return false;
    }
    return true;
  };

  const onSave = async () => {
    if (!email) {
      showSnackbar('Error with logged in user');
      setBusy(false);
      return;
    }
    if (!validateLesson()) {
      return;
    }

    if (editMode) {
      updateDoc(Entity.LESSONS_VIDEO, selectedLesson.id, selectedLesson).then(() => {
        showSnackbar(`${selectedLesson.topic} modified successfully`);
        addNew(courseId);
        fetchData();
        setBusy(false);
      });
    } else {
      addDoc(Entity.LESSONS_VIDEO, selectedLesson).then(() => {
        showSnackbar('Lesson Added');
        addNew(courseId);
        fetchData();
        setBusy(false);
      });
    }
  };

  const changeOrder = (index: number, isUp: boolean) => {
    const clone = [...courseLessons];
    const nextIdx = isUp ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= courseLessons.length) {
      return;
    }
    const item1 = { ...clone[index] };
    const item2 = { ...clone[nextIdx] };

    clone[index] = item2;
    clone[nextIdx] = item1;

    setCourseOrderChaged(true);
    setCourseLessons(clone);
  };

  const saveLessonsOrder = () => {
    setCourseOrderChaged(false);
    const courseLessonIds = courseLessons.map((less) => less.id);
    updateDoc(Entity.COURSES, courseId, { videoLessonOrder: courseLessonIds })
      .then(() => {
        showSnackbar('Lessons order updated');
        setCourses((prev) => {
          const clone = [...prev];
          const idx = clone.findIndex((c) => c.id === courseId);
          clone[idx].videoLessonOrder = courseLessonIds;
          return clone;
        });
      });
  };

  // const onVideoChange = (obj: VideoUrlsObj) => {
  //   console.log('VideoUrlsObj', obj);
  //   // setVideoUrls(obj);
  //   handleChange(o);
  // };

  if (!email) return <></>;

  return (
    <>
      <div className={classes.help}>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={AKSHARA_HELP_VIDEO}
          style={{ margin: '10px' }}
        >
          Videos upload කරන අකාරය
        </a>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={OBS_HELP_VIDEO}
          style={{ marginRight: '10px' }}
        >
          OBS STUDIO හසුරුවන ආකාරය
        </a>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={OBS_DOWNLOAD}
          style={{ marginRight: '10px' }}
        >
          Download  OBS Studio Screen Recorder
        </a>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://www.youtube.com/watch?v=FUtle-pIFs8"
          style={{ marginRight: '10px' }}
        >
          How to reduce size of a video
        </a>
      </div>

      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >

        <div>
          <RadioGroup
            className={classes.twoColumn}
            aria-label="editMode"
            name="editMode"
            value={editMode}
            onChange={(e: any) => {
              if (e.target.value === 'false') {
                addNew(courseId);
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
              value={courseId}
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

          <div>
            <TextField
              className={classes.input}
              id="topic"
              label="Topic"
              inputProps={{ maxLength: 40 }}
              value={selectedLesson.topic}
              disabled={disabled}
              onChange={(e) => handleChange({ topic: e.target.value })}
            />

            <TextField
              className={classes.input}
              id="filled-basic5"
              label="Description"
              value={selectedLesson.description}
              inputProps={{ maxLength: 120 }}
              disabled={disabled}
              onChange={(e) => handleChange({ description: e.target.value })}
            />

            <AddVideo
              videoUrls={selectedLesson.videoUrls}
              // onChange={onVideoChange}
              onChange={(e) => handleChange({ videoUrls: e })}
              disabled={busy}
            />

            <TextField
              className={classes.inputMulti}
              id="standard-multiline-static"
              label="Add GoogleDrive links as separate lines"
              multiline
              rows={3}
              variant="outlined"
              disabled={disabled}
              value={selectedLesson.attachments.reduce((a, b) => (a !== '' ? `${a}\n${b}` : `${b}`), '')}
              // onChange={(e) => {
              //   console.log(e.target.value);
              //   setAttachments(e.target.value.split('\n'));
              // }}
              onChange={(e) => handleChange({ attachments: e.target.value.split('\n') })}
            />
            <TextField
              className={classes.input}
              id="price"
              type="number"
              label="Price"
              value={selectedLesson.price}
              disabled={disabled || Config.paymentDisabled}
              // onChange={(e) => setPrice(Number(e.target.value))}
              onChange={(e) => handleChange({ price: Number(e.target.value) })}
            />
            {teacher && (
            <div>
              <span style={{ marginRight: '5px' }}>Profile url:</span>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={`teacher/${teacher.url}`}
              >
                akshara.lk/teacher/
                {teacher.url}
              </a>
            </div>
            )}
            <Button
              size="small"
              variant="contained"
              color="primary"
              disabled={disabled}
              onClick={onSave}
            >
              {editMode ? 'Save Changes' : 'Save New Lesson'}
            </Button>
          </div>
        </div>

        <div>
          <List
            component="nav"
            aria-label="main mailbox folders"
          >
            {/* {videoURL && editMode && (
            <iframe
              className={classes.player}
              title="video"
              src={videoURL}
            />
            )} */}
            {courseOrderChanged && (
            <ListItem
              button
              onClick={saveLessonsOrder}
              className={classes.saveOrder}
            >
              <ListItemText
                primary="Save order"
              />
              <SaveIcon />
            </ListItem>
            )}
            {
              courseLessons.map((lesson, index) => (
                <div
                // TODO: refresh on lesson add. do not local update
                // c.id becomes undefined for newly added lesson since we refer that from local
                  key={lesson.id}
                >
                  <ListItem
                    button
                    onClick={() => { setEditMode(true); setSelectedLesson(lesson); }}
                  >
                    <div
                      className="fc1"
                      style={{ fontSize: '11px', width: '100%' }}
                    >
                      {lesson.topic}
                    </div>

                    {index > 0 && (
                    <ArrowUpwardIcon onClick={(e) => {
                      changeOrder(index, true); e.stopPropagation();
                    }}
                    />
                    )}
                    {index < courseLessons.length - 1 && (
                    <ArrowDownwardIcon
                      onClick={(e) => { changeOrder(index, false); e.stopPropagation(); }}
                    />
                    )}
                  </ListItem>
                  <Divider />
                </div>
              ))
            }
          </List>
        </div>
      </form>

    </>
  );
};
