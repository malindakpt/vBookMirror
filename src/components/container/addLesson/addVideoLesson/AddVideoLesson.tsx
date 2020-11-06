import React, {
  useState, useEffect, useContext,
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
  addDoc, Entity, getDocsWithProps, updateDoc,
} from '../../../../data/Store';
import { getObject } from '../../../../data/StoreHelper';
import { AppContext } from '../../../../App';
import { IVideoLesson } from '../../../../interfaces/ILesson';
import { ICourse } from '../../../../interfaces/ICourse';
import { IExam } from '../../../../interfaces/IExam';
import { ISubject } from '../../../../interfaces/ISubject';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { useForcedUpdate } from '../../../../hooks/useForcedUpdate';
import Config, {
  AKSHARA_HELP_VIDEO, OBS_DOWNLOAD, OBS_HELP_VIDEO,
} from '../../../../data/Config';

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
  const [allLessons, setAllLessons] = useState<IVideoLesson[]>([]);
  const [courseId, setCourseId] = useState<string>('');

  const [courseLessons, setCourseLessons] = useState<IVideoLesson[]>([]);

  // Component state
  const [editingLesson, setEditingLesson] = useState<IVideoLesson>();

  const [topic, setTopic] = useState<string>('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [videoURL, setVideoURL] = useState<string>('');
  // const [videoId, setVideoId] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Replicate changes of here for all #LessonModify
  const addNew = () => {
    setCourseOrderChaged(false);
    setEditMode(false);
    setTopic('');
    setKeywords('');
    setDescription('');
    setAttachments([]);
    setVideoURL('');
    setPrice(0);
    setDuration(0);

    // resetFileInput();
    // No need to reset courseId
  };

  const onCourseChange = (_courses: ICourse[], _courseId: string, _allLessons: IVideoLesson[]) => {
    if (!_courseId || _courseId === '') { return; }

    setCourseId(_courseId);
    const selectedCourse = _courses.filter((c) => c.id === _courseId)[0];

    const orderedLessons: IVideoLesson[] = [];
    for (const lessonId of selectedCourse.videoLessonOrder) {
      const less = _allLessons.find((l) => l.id === lessonId);
      if (less) {
        orderedLessons.push(less);
      }
    }

    setCourseLessons(orderedLessons);
    addNew();
  };

  useEffect(() => {
    Promise.all([
      getDocsWithProps<ICourse[]>(Entity.COURSES, { ownerEmail: email }),
      getDocsWithProps<IVideoLesson[]>(Entity.LESSONS_VIDEO, { ownerEmail: email }),
    ]).then((values) => {
      const [courses, lessons] = values;

      // state changes
      setCourses(courses);
      setAllLessons(lessons);

      onCourseChange(courses, courseId, lessons);
    });

    // fetch unrelated data
    getDocsWithProps<ISubject[]>(Entity.SUBJECTS, {}).then((data) => setSubjects(data));
    getDocsWithProps<IExam[]>(Entity.EXAMS, {}).then((data) => setExams(data));

    // eslint-disable-next-line
  }, [onDataFetch]);

  const disabled = !courseId || busy;

  const validateLesson = (): boolean => {
    if (!topic || topic.length < 5) {
      showSnackbar('Topic should have minimum length of 5');
      return false;
    }
    if (!description || description.length < 5) {
      showSnackbar('Description should have minimum length of 5');
      return false;
    }
    if (price > 0 && price < 50) {
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
      if (!editingLesson) return;
      // Replicate changes of here for all #LessonModify
      const less: IVideoLesson = {
        ...editingLesson,
        ...{
          topic,
          // watchCount, disable by business logic
          description,
          attachments,
          keywords,
          videoURL,
          // videoId,
          duration,
          // No need to edit courseId
          price,
        },
      };
      updateDoc(Entity.LESSONS_VIDEO, editingLesson.id, less).then(() => {
        showSnackbar(`${editingLesson.topic} modified successfully`);
        addNew();
        fetchData();
        setBusy(false);
      });
    // AddMode
    } else {
      const selectedCourse = courses.filter((c) => c.id === courseId)[0];
      // When you make a change here, replicate that on edit, copyLesson mode also
      // Replicate changes of here for all #LessonModify
      const lesson: IVideoLesson = {
        id: '',
        topic,
        description,
        attachments,
        keywords: `${selectedCourse.examYear}`,
        videoURL,
        duration,
        // videoId,
        price,
        courseId,
        ownerEmail: email,
        subCount: 0,
        createdAt: 0,
      };

      // Add new lesson
      lesson.id = await addDoc(Entity.LESSONS_VIDEO, lesson);
      const { videoLessonOrder } = courses.filter((c) => c.id === courseId)[0];

      // Update lesson order of course
      updateDoc(Entity.COURSES, courseId, { videoLessonOrder: [...videoLessonOrder, lesson.id] }).then(() => {
        showSnackbar('Lesson Added');
        addNew();
        fetchData();
        setBusy(false);
      });
    }
  };

  // copyLessonMode
  // Replicate changes of here for all #LessonModify
  const copyLesson = (les: IVideoLesson) => {
    setEditingLesson(les);
    setTopic(les.topic);
    setKeywords(les.keywords);
    setDescription(les.description);
    setAttachments(les.attachments);
    setVideoURL(les.videoURL);
    // setVideoId(les.videoId);
    setPrice(les.price);
    setDuration(les.duration);

    const videoNode = document.querySelector('video');
    if (videoNode) {
      videoNode.src = les.videoURL;
    }
    // When change here, replicate it in addMode and editModes
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

  if (!email) return <></>;

  return (
    <>
      <div className={classes.help}>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={AKSHARA_HELP_VIDEO}
          style={{ margin: '10px', fontWeight: 'bold' }}
        >
          Video upload කරන අකාරය
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
          Download Screen Recorder
        </a>

        {/* <a
          rel="noopener noreferrer"
          target="_blank"
          href={OBS_HELP_DOC}
        >
          OBS Setup Issues
        </a> */}
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
              onChange={(e) => onCourseChange(courses, e.target.value as string, allLessons)}
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
              value={topic}
              disabled={disabled}
              onChange={(e) => setTopic(e.target.value)}
            />

            <TextField
              className={classes.input}
              id="filled-basic5"
              label="Video URL(Google Drive Embed)"
              value={videoURL}
              disabled={disabled}
              onChange={(e) => setVideoURL(e.target.value)}
            />

            <TextField
              className={classes.input}
              id="filled-basic5"
              label="Description"
              value={description}
              inputProps={{ maxLength: 120 }}
              disabled={disabled}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              className={classes.inputMulti}
              id="standard-multiline-static"
              label="Add GoogleDrive links as separate lines"
              multiline
              rows={3}
              variant="outlined"
              disabled={disabled}
              value={attachments.reduce((a, b) => (a !== '' ? `${a}\n${b}` : `${b}`), '')}
              onChange={(e) => {
                console.log(e.target.value);
                setAttachments(e.target.value.split('\n'));
              }}
            />
            <TextField
              className={classes.input}
              id="price"
              type="number"
              label="Price"
              value={price}
              disabled={disabled || Config.paymentDisabled}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
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
            {videoURL && editMode && (
            <iframe
              className={classes.player}
              title="video"
              src={videoURL}
            />
            )}
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
                    onClick={() => { setEditMode(true); copyLesson(lesson); }}
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
