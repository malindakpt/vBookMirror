import React, { useState, useEffect, useContext } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl, IconButton, RadioGroup, FormControlLabel, Radio, List, ListItem, ListItemIcon, ListItemText, Divider,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import classes from './AddLesson.module.scss';
import { addDoc, getDocsWithProps, updateDoc } from '../../../../data/Store';
import {
  ICourse, ITeacher, ISubject, IExam, ILesson,
} from '../../../../data/Interfaces';
import { getSubject } from '../../../../data/StoreHelper';
import { AppContext } from '../../../../App';

export const AddLesson = () => {
  const { showSnackbar } = useContext(AppContext);
  const [searchText, setSearchText] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [courseId, setCourseId] = useState<string>('');
  const [courseLessons, setCourseLessons] = useState<ILesson[]>([]);
  const [remainingLessons, setRemainingLessons] = useState<ILesson[]>([]);
  const [editingLesson, setEditingLesson] = useState<ILesson>();

  const [topic, setTopic] = useState<string>('');
  const [partNo, setPartNo] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [videoURL, setVideoURL] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    getDocsWithProps('courses', {}, {}).then((data:ICourse[]) => setCourses(data));
    getDocsWithProps('subjects', {}, {}).then((data:ISubject[]) => setSubjects(data));
    getDocsWithProps('exams', {}, {}).then((data:IExam[]) => setExams(data));
    getDocsWithProps('teachers', {}, {}).then((data:ITeacher[]) => setTeachers(data));
    getDocsWithProps('lessons', {}, {}).then((data:ILesson[]) => setLessons(data));
  }, []);

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
      const lesson: ILesson = {
        id: '', topic, partNo, description, keywords, videoURL, price,
      };
      const lessonId = await addDoc('lessons', lesson);
      const { lessons } = courses.filter((c) => c.id === courseId)[0];

      updateDoc('courses', courseId, { lessons: [...lessons ?? [], lessonId] }).then(() => {
        showSnackbar('Course Added');
        setCourses([]); // force update
      });
    }
  };

  const onCourseChange = (e: any) => {
    const courseId = e.target.value;
    setCourseId(courseId);

    const selectedCourse = courses.filter((c) => c.id === courseId)[0];
    // setLessons(courses.filter(c => ))
    const lessons4Course = [];
    const remainingLessons = [];
    for (const les of lessons) {
      if (selectedCourse.lessons.includes(les.id)) {
        lessons4Course.push(les);
      } else {
        remainingLessons.push(les);
      }
    }
    setCourseLessons(lessons4Course);
    setRemainingLessons(remainingLessons);
    // getDocsWithProps('lessons', { }, {}).then((data) => setLessons(data));
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

  return (
    <>
      <h3>Add Lesson</h3>
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
              onChange={onCourseChange}
            >
              {courses.map((t) => {
                const subject = getSubject(subjects, t.subjectId);
                const teacher = getSubject(teachers, t.teacherId);
                const exam = getSubject(exams, t.examId);

                return (
                  <MenuItem
                    value={t.id}
                    key={t.id}
                  >
                    {`${exam?.name} ${subject?.name} ${teacher?.name}`}
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
          <TextField
            className={classes.input}
            id="standard-basic3"
            label="Keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <TextField
            className={classes.input}
            id="standard-basic4"
            label="Video URL"
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
          />
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

          <div className={classes.backlog}>
            {lessons?.length > 0 && (
            <TextField
              className={classes.input}
              id="filled-basic"
              label="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
        )}
            <table className="center">

              <tbody>

                {courseLessons.map((les) => {
                  if (searchText === '' || les.description?.toLowerCase()?.includes(searchText.toLocaleLowerCase())) {
                    return (
                      <tr key={les.id}>
                        <td>{les.description}</td>
                        <td>{les.videoURL}</td>
                        {/* <td>
                          <IconButton
                            aria-label="copy"
                            onClick={() => editLesson(les)}
                          >
                            <FileCopyIcon />
                          </IconButton>
                        </td> */}
                        <td>
                          <IconButton
                            aria-label="copy"
                            onClick={() => { setEditMode(false); copyLesson(les); }}
                          >
                            <FileCopyIcon />
                          </IconButton>
                        </td>
                        {/* <td>
                    <IconButton>
                      <DeleteForeverIcon />
                    </IconButton>
                  </td> */}
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>

          </div>
        </div>
        <div>
          <List
            component="nav"
            aria-label="main mailbox folders"
          >

            {
              courseLessons.map((c) => (
                <div
                  key={c.id}
                >
                  <ListItem
                    button
                    onClick={() => { setEditMode(true); copyLesson(c); }}
                  >
                    <ListItemText primary={`${c.partNo}-${c.topic}`} />
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
