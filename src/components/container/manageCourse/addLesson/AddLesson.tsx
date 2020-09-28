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
  addDoc, getDocsWithProps, updateDoc, uploadFile,
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

  const [editingLesson, setEditingLesson] = useState<ILesson>();
  const [displayBacklog, setDisplayBacklog] = useState<boolean>(false);

  const [topic, setTopic] = useState<string>('');
  const [partNo, setPartNo] = useState<string>('');
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

  const onFileUpload = (e: any) => {
    console.log('Start upload');
    setUploadProgress(100);
    const out = uploadFile(e).subscribe((next) => {
      if (!uploadTask) { setUploadTask(next.uploadTask); }
      if (next.downloadURL) {
        setVideoURL(next.downloadURL);
      }
      setUploadProgress(next.progress);
    });
  };

  const onSave = async () => {
    if (editMode) {
      if (!editingLesson) return;
      const less = {
        ...editingLesson,
        ...{
          topic, partNo, description, keywords, videoURL, price,
        },
      };
      updateDoc('lessons', editingLesson.id, less).then(() => {
        showSnackbar('Lesson Modified');
        setCourses([]); // force update
      });
    } else {
      const selectedCourse = courses.filter((c) => c.id === courseId)[0];
      const lesson: ILesson = {
        id: '',
        date: new Date().getTime(),
        topic,
        partNo,
        description,
        keywords: `${selectedCourse.examYear}`,
        videoURL,
        price,
        email: email as string,
      };
      const lessonId = await addDoc('lessons', lesson);
      const { lessons } = courses.filter((c) => c.id === courseId)[0];

      updateDoc('courses', courseId, { lessons: [...lessons ?? [], lessonId] }).then(() => {
        showSnackbar('Course Added');
        setCourseLessons((prev) => {
          const clone = [...prev, lesson];
          return clone;
        });
        // setCourses([]); // force update
      });
    }
  };

  const copyLesson = (les: ILesson) => {
    setEditingLesson(les);
    setTopic(les.topic ?? '');
    setPartNo(les.partNo ?? '');
    setKeywords(les.keywords ?? '');
    setDescription(les.description ?? '');
    setVideoURL(les.videoURL ?? '');
  };

  const addNew = () => {
    setEditMode(false);

    setTopic('');
    setPartNo('');
    setKeywords('');
    setDescription('');
    setVideoURL('');
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

      {/* <label htmlFor="myfile">Select a file:</label> */}

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
            />
            <FormControlLabel
              value
              control={<Radio />}
              label="Edit lesson"
            />
          </RadioGroup>

          <TextField
            className={classes.input}
            id="standard-basic1"
            label="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <TextField
            className={classes.input}
            id="standard-basic2"
            label="Part No"
            value={partNo}
            onChange={(e) => setPartNo(e.target.value)}
          />
          <div className={classes.video}>
            <TextField
              className={classes.input}
              id="standard-basic4"
              label="Video URL"
              disabled
              value={videoURL}
              onChange={(e) => setVideoURL(e.target.value)}
            />
            <div>
              {uploadProgress === 0 && (
              <input
                type="file"
                id="uploader"
                name="uploader"
                onChange={onFileUpload}
              />
              )}
              <span>{uploadProgress > 0 && uploadProgress < 100 && `${Math.round(uploadProgress)}%`}</span>
              {uploadProgress > 0 && uploadProgress < 100 && (
              <Button
                variant="contained"
                onClick={onSave}
              >
                Cancel Upload NA
              </Button>
              )}
            </div>
          </div>

          <TextField
            className={classes.input}
            id="filled-basic5"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            className={classes.input}
            id="filled-basic6"
            type="number"
            label="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <Button
            variant="contained"
            onClick={onSave}
          >
            {editMode ? 'Save Changes' : 'Add New Lesson'}
          </Button>

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
              courseLessons.map((c, index) => (
                <div
                  key={c.id + c.videoURL}
                >
                  <ListItem
                    button
                  >
                    <ListItemText
                      primary={`${c.partNo}-${c.topic}`}
                      onClick={() => { setEditMode(true); copyLesson(c); }}
                    />
                    {index > 0 && <ArrowUpwardIcon onClick={(e) => { changeOrder(index, true); }} />}
                    {index < courseLessons.length - 1 && (
                    <ArrowDownwardIcon
                      onClick={(e) => { changeOrder(index, false); }}
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
      <div className={classes.backlog}>
        {allLessons.current?.length > 0 && (
        <TextField
          className={classes.input}
          id="filled-basic"
          label="Search lessons..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setDisplayBacklog(true)}
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
    </>
  );
};
