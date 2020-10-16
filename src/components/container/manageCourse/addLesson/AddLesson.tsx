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
  addDoc, getDocsWithProps, updateDoc, uploadVideo,
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
  const [onDataFetch, fetchData] = useForcedUpdate();
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
  const [allLessons, setAllLessons] = useState<ILesson[]>([]);
  // const allLessons = useRef<ILesson[]>([]);
  const [courseId, setCourseId] = useState<string>('');

  const [courseLessons, setCourseLessons] = useState<ILesson[]>([]);
  const [unrelatedLessons, setUnrelatedLessons] = useState<ILesson[]>([]);

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

  const addNew = () => {
    setCourseOrderChaged(false);
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

  const onCourseChange = (_courses: ICourse[], _courseId: string, _allLessons: ILesson[]) => {
    if (!_courseId || _courseId === '') { return; }

    setCourseId(_courseId);

    const selectedCourse = _courses.filter((c) => c.id === _courseId)[0];
    const lessons4CourseMap: any = {};
    const otherLessons = [];

    for (const les of _allLessons) {
      if (selectedCourse.lessons?.includes(les.id)) {
        lessons4CourseMap[les.id] = les;
      } else {
        otherLessons.push(les);
      }
    }

    let orderedLessons: ILesson[] = [];
    for (const less of selectedCourse.lessons) {
      const t = (lessons4CourseMap[less]);
      if (t) {
        orderedLessons = [...orderedLessons, t];
      }
    }

    setCourseLessons(orderedLessons);
    setUnrelatedLessons(otherLessons.sort((a, b) => b.date - a.date));

    addNew();
  };

  useEffect(() => {
    Promise.all([
      getDocsWithProps<ICourse[]>('courses', { ownerEmail: email }),
      getDocsWithProps<ILesson[]>('lessons', { ownerEmail: email }),
    ]).then((values) => {
      const [courses, lessons] = values;

      // state changes
      setCourses(courses);
      setAllLessons(lessons);

      onCourseChange(courses, courseId, lessons);
    });

    // fetch unrelated data
    getDocsWithProps<ISubject[]>('subjects', {}).then((data) => setSubjects(data));
    getDocsWithProps<IExam[]>('exams', {}).then((data) => setExams(data));

    // eslint-disable-next-line
  }, [onDataFetch]);

  const onFileSelect = (e: any) => {
    // TODO: Handle if file is not selected from file explorer
    const file = e.target.files[0];
    if (file) { setUploadFile(file); }
  };

  const onCancelUpload = () => {
    uploadTask?.cancel();
    addNew();
  };

  const disabled = uploadProgress > 0 && uploadProgress < 100;

  const onSave = async (videoURL: string) => {
    if (!email) {
      showSnackbar('Error with logged in user');
      return;
    }
    if (editMode) {
      if (!editingLesson) return;
      // When you make a change here, replicate that on addMode, copyLesson also
      const less = {
        ...editingLesson,
        ...{
          topic, description, attachments, keywords, videoURL, price,
        },
      };
      updateDoc('lessons', editingLesson.id, less).then(() => {
        showSnackbar(`${editingLesson.topic} modified successfully`);
        addNew();
        fetchData();
      });
    // AddMode
    } else {
      const selectedCourse = courses.filter((c) => c.id === courseId)[0];
      // When you make a change here, replicate that on edit, copyLesson mode also
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
      lesson.id = await addDoc('lessons', lesson);
      const { lessons } = courses.filter((c) => c.id === courseId)[0];

      await updateDoc('courses', courseId, { lessons: [lesson.id, ...lessons ?? []] });
      showSnackbar('Lesson Added');
      addNew();
      fetchData();
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
          if (next.progress < 100) {
            setUploadProgress(next.progress);
          }
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

  // copyLessonMode
  const copyLesson = (les: ILesson) => {
    setIsAddNewVideo(false);
    setEditingLesson(les);
    setTopic(les.topic ?? '');
    setKeywords(les.keywords ?? '');
    setDescription(les.description ?? '');
    setAttachments(les.attachments ?? []);
    setVideoURL(les.videoURL ?? '');
    setPrice(les.price ?? 0);
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
    const courseLessonIds = courseLessons.map((less) => less.id);
    updateDoc('courses', courseId, { lessons: courseLessonIds })
      .then(() => {
        showSnackbar('Lessons order updated');
        setCourses((prev) => {
          const clone = [...prev];
          const idx = clone.findIndex((c) => c.id === courseId);
          clone[idx].lessons = courseLessonIds;
          return clone;
        });
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
              {allLessons.length > 0 && (
              <TextField
                className={classes.input}
                id="filled-basic"
                label="Search Previous Lessons..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onBlur={() => setTimeout(() => setDisplayBacklog(false), 400)}
                onFocus={() => setDisplayBacklog(true)}
                disabled={disabled}
              />
              )}
              { displayBacklog && (
              <table className="center w100">
                <tbody>
                  {unrelatedLessons.map((les) => {
                    const search = searchText.toLocaleLowerCase();
                    if (searchText === ''
                  || les.topic?.toLowerCase()?.includes(search)
                   || les.description?.toLowerCase()?.includes(search)) {
                      return (
                        <tr
                          key={les.id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setEditMode(false);
                            copyLesson(les);
                            setDisplayBacklog(false);
                          }}
                        >
                          <td>{les.date ? new Date(les.date).toDateString() : 'N/A'}</td>
                          <td>{les.topic}</td>
                          <td>{les.description}</td>
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
              label="Upload tutorials to GoogleDrive and paste the link here(*Add each of them in a new line)"
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
              !disabled && courseLessons.map((lesson, index) => (
                <div
                // c.id becomes undefined for newly added lesson since we refer that from local
                  key={lesson.date}
                >
                  <ListItem
                    button
                    onClick={() => { setEditMode(true); copyLesson(lesson); }}
                  >
                    <div style={{ fontSize: '11px', width: '100%' }}>
                      {lesson.topic}
                    </div>
                    {/* primary={`${lesson.topic}`}
                      style={{ fontSize: '11px' }}
                    /> */}
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
