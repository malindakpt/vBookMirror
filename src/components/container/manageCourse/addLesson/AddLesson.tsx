import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl, IconButton,
  RadioGroup, FormControlLabel, Radio, List, ListItem, ListItemText, Divider,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SaveIcon from '@material-ui/icons/Save';
import classes from './AddLesson.module.scss';
import {
  addDoc, getDocsWithProps, updateDoc, uploadVideo,
} from '../../../../data/Store';
import { getObject } from '../../../../data/StoreHelper';
import { AppContext } from '../../../../App';
import { ILesson } from '../../../../interfaces/ILesson';
import { ICourse } from '../../../../interfaces/ICourse';
import { IExam } from '../../../../interfaces/IExam';
import { ISubject } from '../../../../interfaces/ISubject';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';

export const AddLesson = () => {
  useBreadcrumb();
  const { showSnackbar, email } = useContext(AppContext);

  const [uploadTask, setUploadTask] = useState<any>();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [uploadFile, setUploadFile] = useState<any>(undefined);
  const [searchText, setSearchText] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [courseOrderChanged, setCourseOrderChaged] = useState<boolean>(false);

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const allLessons = useRef<ILesson[]>([]);
  const [courseId, setCourseId] = useState<string>('');

  const [courseLessons, setCourseLessons] = useState<ILesson[]>([]);
  const [remainingLessons, setRemainingLessons] = useState<ILesson[]>([]);

  // Component state
  const [isAddNewVideo, setIsAddNewVideo] = useState<boolean>(false);
  const [editingLesson, setEditingLesson] = useState<ILesson>();
  const [displayBacklog, setDisplayBacklog] = useState<boolean>(false);

  const [topic, setTopic] = useState<string>('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [videoURL, setVideoURL] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

  const onCourseChange = (courses: ICourse[], courseId: string) => {
    if (!courseId || courseId === '') { return; }

    setCourseId(courseId);

    const selectedCourse = courses.filter((c) => c.id === courseId)[0];
    const lessons4CourseMap: any = {};
    const remainingLessons = [];
    for (const les of allLessons.current) {
      if (selectedCourse.lessons?.includes(les.id)) {
        lessons4CourseMap[les.id] = les;
      } else {
        remainingLessons.push(les);
      }
    }

    const orderedLessons = [];
    for (const less of selectedCourse.lessons) {
      const t = (lessons4CourseMap[less]);
      t && orderedLessons.push(t);
    }

    remainingLessons.sort((a, b) => (a.date > b.date ? -1 : 1));

    setCourseLessons(orderedLessons);
    setRemainingLessons(remainingLessons);
  };

  useEffect(() => {
    Promise.all([
      getDocsWithProps<ICourse[]>('courses', {}),
      getDocsWithProps<ILesson[]>('lessons', {}),
    ]).then((values) => {
      const [courses, lessons] = values;

      setCourses(courses);
      onCourseChange(courses, courseId);

      allLessons.current = lessons;
    });
    getDocsWithProps<ISubject[]>('subjects', {}).then((data) => setSubjects(data));
    getDocsWithProps<IExam[]>('exams', {}).then((data) => setExams(data));
    // eslint-disable-next-line
  }, [courses]);

  const onFileSelect = (e: any) => {
    // TODO: Handle if file is not selected from file explorer
    const file = e.target.files[0];
    if (file) { setUploadFile(file); }
  };

  const addNew = () => {
    setIsAddNewVideo(false);
    setEditMode(false);
    setUploadProgress(0);
    setTopic('');
    setKeywords('');
    setDescription('');
    setAttachments([]);
    setVideoURL('');
    setPrice(0);
    setUploadFile(null);
  };

  const onCancelUpload = () => {
    uploadTask?.cancel();
    addNew();
  };

  const disabled = uploadProgress > 0 && uploadProgress < 100;

  const onSave = async (videoURL: string) => {
    if (!email) {
      showSnackbar('Issue with email');
      return;
    }
    if (editMode) {
      if (!editingLesson) return;
      const less = {
        ...editingLesson,
        ...{
          topic, description, attachments, keywords, videoURL, price,
        },
      };
      updateDoc('lessons', editingLesson.id, less).then(() => {
        showSnackbar('Lesson Modified');
        addNew();
        setCourses([]); // force update
      });
    } else {
      const selectedCourse = courses.filter((c) => c.id === courseId)[0];
      // When you make a change here, replicate that on edit mode also
      const lesson: ILesson = {
        id: '',
        date: new Date().getTime(),
        topic,
        description,
        attachments,
        keywords: `${selectedCourse.examYear}`,
        videoURL,
        price,
        ownerEmail: email,
      };
      const lessonId = await addDoc('lessons', lesson);
      const { lessons } = courses.filter((c) => c.id === courseId)[0];

      updateDoc('courses', courseId, { lessons: [...lessons ?? [], lessonId] }).then((data) => {
        showSnackbar('Lesson Added');
        addNew();
        setCourseLessons((prev) => {
          const clone = [lesson, ...prev];
          return clone;
        });
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

  const sendVideo = (e: any) => {
    if (!email) {
      showSnackbar('Error with the logged in teacher');
      return;
    }
    if (!validateLesson()) {
      return;
    }

    if (isAddNewVideo) {
      if (uploadFile) {
        const vId = `${new Date().getTime()}`;
        setUploadProgress(0);
        const out = uploadVideo(uploadFile, email, vId).subscribe((next) => {
          setUploadTask(next.uploadTask);
          if (next.downloadURL) {
            setVideoURL(next.downloadURL);
            onSave(next.downloadURL);
            out.unsubscribe();
          }
          if (next.progress < 100) { setUploadProgress(next.progress); }
        });
      } else {
        showSnackbar('Upload video not found');
      }
    } else {
      if (videoURL) {
        onSave(videoURL);
      } else {
        showSnackbar('Upload video not found');
      }
    }
  };

  const copyLesson = (les: ILesson) => {
    setIsAddNewVideo(false);
    setEditingLesson(les);
    setTopic(les.topic ?? '');
    setKeywords(les.keywords ?? '');
    setDescription(les.description ?? '');
    setAttachments(les.attachments ?? []);
    setVideoURL(les.videoURL ?? '');
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
    updateDoc('courses', courseId, { lessons: courseLessons.map((less) => less.id) })
      .then(() => {
        showSnackbar('Lessons order updated');
        setCourseOrderChaged(false);
      });
  };

  if (!email) return <></>;

  return (
    <>
      <h3>Manage Lessons</h3>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <div>
          <FormControl className={classes.input}>
            <InputLabel id="demo-simple-select-label">Select Course</InputLabel>
            <Select
              className={classes.input}
              labelId="label1"
              id="id1"
              value={courseId}
              disabled={disabled}
              onChange={(e) => onCourseChange(courses, e.target.value as string)}
            >
              {courses.map((course) => {
                const subject = getObject(subjects, course.subjectId);
                const exam = getObject(exams, course.examId);

                return (
                  <MenuItem
                    value={course.id}
                    key={course.id}
                  >
                    {`${course.examYear}-${exam?.name}-${exam?.type}-${subject?.name}`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {courseId && (
          <div>
            <RadioGroup
              className={classes.twoColumn}
              aria-label="gender"
              name="gender1"
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
              id="standard-basic1"
              label="Topic"
              value={topic}
              disabled={disabled}
              onChange={(e) => setTopic(e.target.value)}
            />
            <RadioGroup
              className={classes.twoColumn}
              aria-label="gender"
              name="gender1"
              value={isAddNewVideo}
              onChange={(e: any) => { setIsAddNewVideo(e.target.value === 'true'); }}
            >
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Copy Previous Video"
                disabled={disabled}
              />
              <FormControlLabel
                value
                control={<Radio />}
                label="Upload New Video"
                disabled={disabled}
              />
            </RadioGroup>

            { !isAddNewVideo && (
            <div className={classes.backlog}>
              {allLessons.current?.length > 0 && (
              <TextField
                className={classes.input}
                id="filled-basic"
                label="Search Previous Lessons..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setDisplayBacklog(true)}
                disabled={disabled}
              />
              )}
              { displayBacklog && (
              <table className="center w100">
                <tbody>
                  {remainingLessons.map((les) => {
                    const search = searchText.toLocaleLowerCase();
                    if (searchText === ''
                  || les.topic?.toLowerCase()?.includes(search)
                   || les.description?.toLowerCase()?.includes(search)) {
                      return (
                        <tr key={les.id}>
                          <td>{les.date ? new Date(les.date).toDateString() : 'N/A'}</td>
                          <td>{les.topic}</td>
                          <td>{les.description}</td>
                          <td>
                            <IconButton
                              aria-label="copy"
                              onClick={() => { setEditMode(false); copyLesson(les); }}
                            >
                              <FileCopyIcon />
                            </IconButton>
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
              )}
            </div>
            )}

            <div className={classes.video}>
              {isAddNewVideo && (
              <>
                {!disabled && (
                <input
                  type="file"
                  id="uploader"
                  name="uploader"
                  onChange={onFileSelect}
                  disabled={disabled}
                />
                )}
                <span>{uploadProgress > 0 && uploadProgress < 100 && `${Math.round(uploadProgress)}%`}</span>
                {uploadProgress > 0 && uploadProgress < 100 && (
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={onCancelUpload}
                >
                  Cancel Upload
                </Button>
                )}
              </>
              )}
            </div>

            <TextField
              className={classes.input}
              id="standard-basic4"
              label="Video Id"
              disabled
              value={videoURL}
              onChange={(e) => setVideoURL(e.target.value)}
            />

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
              label="Attachment links(Use new line to add)"
              multiline
              rows={3}
              variant="outlined"
              value={attachments.reduce((a, b) => (a !== '' ? `${a}\n${b}` : `${b}`), '')}
              onChange={(e) => {
                console.log(e.target.value);
                setAttachments(e.target.value.split('\n'));
              }}
            />

            <TextField
              className={classes.input}
              id="filled-basic6"
              type="number"
              label="Price"
              value={price}
              disabled={disabled}
              onChange={(e) => setPrice(Number(e.target.value))}
            />

            {uploadProgress === 0 && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              disabled={disabled}
              onClick={sendVideo}
            >
              {editMode ? 'Save Changes' : 'Add New Lesson'}
            </Button>
            )}
          </div>
          )}
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
              !disabled && courseLessons.map((c, index) => (
                <div
                // c.id becomes undefined for newly added lesson since we refer that from local
                  key={c.videoURL}
                >
                  <ListItem
                    button
                    onClick={() => { setEditMode(true); copyLesson(c); }}
                  >
                    <ListItemText
                      primary={`${c.topic}`}
                    />
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
