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
import classes from './AddLesson.module.scss';
import {
  addDoc, deleteVideo, Entity, getDocsWithProps, updateDoc, uploadVideoToServer,
} from '../../../../data/Store';
import { getObject } from '../../../../data/StoreHelper';
import { AppContext } from '../../../../App';
import { ILesson } from '../../../../interfaces/ILesson';
import { ICourse } from '../../../../interfaces/ICourse';
import { IExam } from '../../../../interfaces/IExam';
import { ISubject } from '../../../../interfaces/ISubject';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { useForcedUpdate } from '../../../../hooks/useForcedUpdate';

export const AddLesson = () => {
  useBreadcrumb();
  const [busy, setBusy] = useState<boolean>(false);
  const [onDataFetch, fetchData] = useForcedUpdate();
  const { showSnackbar, email } = useContext(AppContext);

  const [uploadTask, setUploadTask] = useState<any>();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [uploadFile, setUploadFile] = useState<File>();

  const [editMode, setEditMode] = useState<boolean>(false);
  const [courseOrderChanged, setCourseOrderChaged] = useState<boolean>(false);

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [allLessons, setAllLessons] = useState<ILesson[]>([]);
  const [courseId, setCourseId] = useState<string>('');

  const [courseLessons, setCourseLessons] = useState<ILesson[]>([]);

  // Component state
  const [editingLesson, setEditingLesson] = useState<ILesson>();

  const [topic, setTopic] = useState<string>('');
  const [watchCount, setWatchCount] = useState<number>(2);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [videoURL, setVideoURL] = useState<string>('');
  const [videoId, setVideoId] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Replicate changes of here for all #LessonModify
  const addNew = () => {
    setCourseOrderChaged(false);
    setEditMode(false);
    setUploadProgress(0);
    setTopic('');
    setWatchCount(2);
    setKeywords('');
    setDescription('');
    setAttachments([]);
    setVideoURL('');
    setPrice(0);
    setDuration(0);

    setUploadFile(undefined);
    // No need to reset courseId

    // Rest video thumbnail
    const videoNode = document.querySelector('video');
    if (videoNode) {
      videoNode.src = '';
    }
  };

  const onCourseChange = (_courses: ICourse[], _courseId: string, _allLessons: ILesson[]) => {
    if (!_courseId || _courseId === '') { return; }

    setCourseId(_courseId);
    const selectedCourse = _courses.filter((c) => c.id === _courseId)[0];

    const orderedLessons: ILesson[] = [];
    for (const lessonId of selectedCourse.lessons) {
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
      getDocsWithProps<ILesson[]>(Entity.LESSONS, { ownerEmail: email }),
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

  const onFileSelect = (e: any) => {
    const limit = 5;
    // TODO: Handle if file is not selected from file explorer
    const file: File = e.target.files[0];
    const videoNode = document.querySelector('video');

    if (file && videoNode) {
      const size = file.size / (1024 * 1024);
      const fileURL = URL.createObjectURL(file);
      videoNode.src = fileURL;

      setTimeout(() => {
        const duration = Math.round((videoNode.duration * 10) / 60) / 10;
        const ratio = (size / duration);
        if (ratio > 5) {
          const allowedSize = Math.round(limit * duration * 10) / 10;
          showSnackbar(`Maximum ${allowedSize}Mb allowed for ${duration} minutes video`);
          videoNode.src = '';
          setUploadFile(undefined);
        }

        if (size > 600) {
          showSnackbar('Error: Maximum file size is 600Mb');
        } else {
          // success
          setUploadFile(file);
          setDuration(duration);
        }
      }, 1000);
    }
  };

  const onCancelUpload = () => {
    uploadTask?.cancel();
    addNew();
  };

  const disabled = (uploadProgress > 0 && uploadProgress < 100) || !courseId || busy;

  const disabledCourseSelection = (uploadProgress > 0 && uploadProgress < 100);

  const onSave = async (videoURL: string, videoId: string, date: number, duration: number) => {
    if (!email) {
      showSnackbar('Error with logged in user');
      setBusy(false);
      return;
    }
    if (editMode) {
      if (!editingLesson) return;
      // Replicate changes of here for all #LessonModify
      const less: ILesson = {
        ...editingLesson,
        ...{
          topic,
          // watchCount, disable by business logic
          description,
          attachments,
          keywords,
          videoURL,
          videoId,
          duration,
          // No need to edit courseId
          // price, disabled by business logic
        },
      };
      updateDoc(Entity.LESSONS, editingLesson.id, less).then(() => {
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
      const lesson: ILesson = {
        id: '',
        date,
        topic,
        watchCount,
        description,
        attachments,
        keywords: `${selectedCourse.examYear}`,
        videoURL,
        duration,
        videoId,
        price,
        courseId,
        subCount: 0,
        ownerEmail: email,
      };
      lesson.id = await addDoc(Entity.LESSONS, lesson);
      const { lessons } = courses.filter((c) => c.id === courseId)[0];

      updateDoc(Entity.COURSES, courseId, { lessons: [...lessons, lesson.id] }).then(() => {
        showSnackbar('Lesson Added');
        addNew();
        fetchData();
        setBusy(false);
      });
    }
  };

  const validateLesson = (): boolean => {
    if (!topic || topic.length < 5) {
      showSnackbar('Topic should have minimum length of 5');
      return false;
    }
    if (!description || description.length < 5) {
      showSnackbar('Description should have minimum length of 5');
      return false;
    }
    return true;
  };

  const uploadAndSave = (email: string, dd: number) => {
    if (!uploadFile) return;

    setUploadProgress(0);
    const out = uploadVideoToServer(uploadFile, email, `${dd}`).subscribe((next) => {
      setUploadTask(next.uploadTask);
      if (next.downloadURL) {
        // upload completed
        setVideoURL(next.downloadURL);
        onSave(next.downloadURL, `${dd}`, dd, duration);
        out.unsubscribe();
      }
      if (next.progress < 100) {
        setUploadProgress(next.progress);
      }
    });
  };

  const startUploadVideo = (e: any) => {
    const dd = new Date().getTime();
    if (!email) {
      showSnackbar('Error with the logged in teacher');
      return;
    }
    if (!validateLesson()) {
      return;
    }
    setBusy(true);
    if (editMode) {
      if (uploadFile) {
        deleteVideo(email, videoId).then((data) => console.log('deleted', data));
        uploadAndSave(email, dd);
      } else {
        onSave(videoURL, videoId, dd, duration);
      }
    } else {
      if (uploadFile) {
        uploadAndSave(email, dd);
      } else {
        showSnackbar('Upload video not found');
        setBusy(false);
      }
    }
  };

  // copyLessonMode
  // Replicate changes of here for all #LessonModify
  const copyLesson = (les: ILesson) => {
    setEditingLesson(les);
    setTopic(les.topic);
    setWatchCount(les.watchCount);
    setKeywords(les.keywords);
    setDescription(les.description);
    setAttachments(les.attachments);
    setVideoURL(les.videoURL);
    setVideoId(les.videoId);
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
    updateDoc(Entity.COURSES, courseId, { lessons: courseLessonIds })
      .then(() => {
        showSnackbar('Lessons order updated');
        setCourses((prev) => {
          const clone = [...prev];
          const idx = clone.findIndex((c) => c.id === courseId);
          clone[idx].lessons = courseLessonIds;
          return clone;
        });
      });
  };

  if (!email) return <></>;

  return (
    <>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <div>
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
              disabled={disabledCourseSelection}
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
            {/* <TextField
              className={`${classes.input} fc1`}
              id="examYear"
              label="Exam Year"
              value={examYear}
              onChange={(e) => setExamYear(e.target.value)}
            />
            <Button onClick={editCourseYear}>Change</Button> */}
            <RadioGroup
              className={classes.twoColumn}
              aria-label="editMode"
              name="editMode"
              value={editMode}
              onChange={(e: any) => { e.target.value === 'false' && addNew(); }}
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
              value={topic}
              disabled={disabled}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div className={classes.video}>
              <>
                <div className={classes.buttons}>

                  <input
                    type="file"
                    id="uploader"
                    name="uploader"
                    onChange={onFileSelect}
                    disabled={disabled}
                  />

                  {uploadProgress > 0 && uploadProgress < 100 && (
                  <Button
                    size="small"
                    color="secondary"
                    variant="contained"
                    onClick={onCancelUpload}
                  >
                    Cancel Upload
                    <span style={{ marginLeft: '20px' }}>
                      {uploadProgress > 0 && uploadProgress < 100 && `${Math.round(uploadProgress)}%`}
                    </span>
                  </Button>

                  )}
                  <div className={classes.note}>
                    Max 5Mb allowed for 1 minute of the video.
                    <br />
                    Eg: If video length is 1 hour(60 minutes), size should be less than 300Mb.
                  </div>
                </div>

                <video
                  id="myVideo"
                  width="320"
                  height="176"
                  controls
                >
                  <track
                    kind="captions"
                  />

                </video>

              </>
            </div>

            <TextField
              className={classes.input}
              id="filled-basic5"
              label="Description"
              value={description}
              disabled={disabled}
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              className={classes.inputMulti}
              id="standard-multiline-static"
              label="Upload tutorials to GoogleDrive and paste the link here(*Add each of them in a new line)"
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
              disabled={disabled || editMode} // do not allow changes after added
              onChange={(e) => setPrice(Number(e.target.value))}
            />

            {/* <TextField
              className={classes.input}
              id="watchCount"
              type="number"
              label="Watch Count Per Payment"
              value={watchCount}
              disabled={disabled || editMode}
              onChange={(e) => setWatchCount(Number(e.target.value))}
            /> */}

            {uploadProgress === 0 && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              disabled={disabled}
              onClick={startUploadVideo}
            >
              {editMode ? 'Save Changes' : 'Add New Lesson'}
            </Button>
            )}
          </div>
        </div>

        <div>
          <List
            component="nav"
            aria-label="main mailbox folders"
          >
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
                // c.id becomes undefined for newly added lesson since we refer that from local
                  key={lesson.date}
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
