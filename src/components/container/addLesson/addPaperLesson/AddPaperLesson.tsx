import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import {
  Button, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField,
} from '@material-ui/core';
import { MCQAnswer, Status } from './mcqAnswer/MCQAnswer';
import { FileUploader } from '../../../presentational/fileUploader/FileUploader';
import {
  addDoc, Entity, FileType, getDocsWithProps, updateDoc,
} from '../../../../data/Store';
import { PDFView } from '../../../presentational/pdfView/PDFView';
import { AppContext } from '../../../../App';
import { ICourse } from '../../../../interfaces/ICourse';
import { getObject } from '../../../../data/StoreHelper';
import { IExam } from '../../../../interfaces/IExam';
import { ISubject } from '../../../../interfaces/ISubject';
import {
  AnswerSheetStatus,
  emptyVideoObj, IPaperLesson, LessonType,
} from '../../../../interfaces/ILesson';
import { LessonList } from '../../../presentational/lessonList/LessonList';
import { AddVideo } from '../../../presentational/addVideo/AddVideo';
import classes from './AddPaperLesson.module.scss';
import { IReport } from '../../../../interfaces/IReport';

export const AddPaperLesson = () => {
  const { email, showSnackbar } = useContext(AppContext);
  const fileRef = useRef<any>();
  const newPaper: IPaperLesson = {
    id: '',
    attachments: [],
    duration: 0,
    keywords: '',
    courseId: '',
    orderIndex: 0,
    answers: [],
    videoUrl: '',
    answersSheetStatus: AnswerSheetStatus.SHOW,
    price: 0,
    possibleAnswers: ['1', '2', '3', '4', '5'],
    topic: '',
    description: '',
    pdfURL: '',
    pdfId: `${new Date().getTime()}`,
    ownerEmail: email || '',
    type: LessonType.PAPER,

    videoUrls: [emptyVideoObj],
  };
  // const [allPapers, setAllPapers] = useState<IPaperLesson[]>([]);
  const [busy, setBusy] = useState<boolean>(false);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [paper, setPaper] = useState<IPaperLesson>(newPaper);
  const [lastUpdated, setLastUpdate] = useState<number>(0);
  // const [courseOrderChanged, setCourseOrderChaged] = useState<boolean>(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [courseId, setCourseId] = useState<string>('');

  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [reports, setReports] = useState<IReport[]>([]);

  const addNew = () => {
    setPaper(newPaper);
    setEditMode(false);
  };

  const beforeAdd = () => {
    paper.courseId = courseId;
    paper.pdfId = `${new Date().getTime()}`;
  };

  useEffect(() => {
    // fetch unrelated data
    getDocsWithProps<ICourse>(Entity.COURSES, { ownerEmail: email })
      .then((courses) => { courses && setCourses(courses); });
    getDocsWithProps<ISubject>(Entity.SUBJECTS, {}).then((data) => setSubjects(data));
    getDocsWithProps<IExam>(Entity.EXAMS, {}).then((data) => setExams(data));
    // eslint-disable-next-line
  }, []);

  const disabled = !courseId || busy;

  const handleChange = (obj: Record<string, any>) => {
    setPaper((prev) => {
      const clone = { ...prev, ...obj };
      return clone;
    });
  };

  const addQuestion = () => {
    if (disabled) return;

    setPaper((prev) => {
      const clone = { ...prev };
      clone.answers = [...clone.answers, { ans: '0' }];
      return clone;
    });
  };

  const removeQuestion = () => {
    if (disabled) return;

    setPaper((prev) => {
      const clone = { ...prev };
      clone.answers.splice(clone.answers.length - 1, 1);
      return clone;
    });
  };

  const handleSuccess = (pdfUrl: string | null) => {
    // const clone = { ...paper };

    if (isEditMode) {
      if (pdfUrl) {
        paper.pdfURL = pdfUrl;
      } else {
        // No need to set ref
      }
    } else {
      if (!pdfUrl) {
        showSnackbar('Upload file not found');
        setBusy(false);
        return;
      }
      paper.pdfURL = pdfUrl;
    }

    if (isEditMode) {
      updateDoc(Entity.LESSONS_PAPER, paper.id, paper).then(() => {
        showSnackbar(`Edited: ${paper.topic}`);
        setEditMode(false);
        addNew();
        setBusy(false);
        setLastUpdate(new Date().getTime());
      });
    } else {
      beforeAdd();
      addDoc<IPaperLesson>(Entity.LESSONS_PAPER, paper).then(() => {
        showSnackbar(`Added: ${paper.topic}`);
        addNew();
        setBusy(false);
        setLastUpdate(new Date().getTime());
      });
    }
  };

  const onCourseChange = (_courseId: string) => {
    setCourseId(_courseId);
  };

  const clickEdit = (paper: IPaperLesson) => {
    setPaper(paper);
    setEditMode(true);
  };

  const fetchTopMarks = () => {
    getDocsWithProps<IReport>(Entity.REPORTS, {}).then((data) => setReports(data));
  };

  const validate = () => {
    if (paper.topic === '') {
      showSnackbar('Please add a Topic');
      return;
    }
    if (paper.description === '') {
      showSnackbar('Please add a Description');
      return;
    }
    setBusy(true);
    fileRef?.current?.startUploading();
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div className={classes.help}>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://youtu.be/vSQTMkHxiag"
            style={{ margin: '10px' }}
          >
            Papers add කරන අකාරය
          </a>
        </div>
        <div className={classes.help}>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://youtu.be/24HPqXjVIBo"
            style={{ margin: '10px' }}
          >
            How to upload a video to GoogleDrive
          </a>
        </div>
        <div className={classes.help}>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://youtu.be/YmFne6P5cOc"
            style={{ margin: '10px' }}
          >
            සිසුවන්ට Papers  පෙන්වන ආකාරය
          </a>
        </div>
      </div>
      <div className={classes.container}>
        <div>
          <div className={classes.top}>
            <RadioGroup
              className={classes.twoColumn}
              aria-label="editMode"
              name="editMode"
              value={isEditMode}
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
                className={`${classes.input}`}
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
            <TextField
              id="topic"
              label="Topic"
              disabled={disabled}
              value={paper.topic}
              inputProps={{ maxLength: 50 }}
              onChange={(e) => handleChange({ topic: e.target.value })}
            />
            <TextField
              className={classes.input}
              id="description"
              label="Description"
              disabled={disabled}
              value={paper.description}
              inputProps={{ maxLength: 120 }}
              onChange={(e) => handleChange({ description: e.target.value })}
            />

            <AddVideo
              videoUrls={paper.videoUrls}
              onChange={(e) => handleChange({ videoUrls: e })}
              disabled={disabled}
            />

            <FormControl className={classes.input}>
              <InputLabel
                id="showans"
                className="fc1"
              >
                Show/Hide Answers
              </InputLabel>
              <Select
                disabled={disabled}
                className={`${classes.input}`}
                labelId="label1"
                id="id1"
                value={paper.answersSheetStatus}
                onChange={(e) => handleChange({ answersSheetStatus: e.target.value })}
              >

                <MenuItem
                  value={AnswerSheetStatus.SHOW}
                >
                  Show Answers
                </MenuItem>

                <MenuItem
                  value={AnswerSheetStatus.HIDE}
                >
                  Hide Answers
                </MenuItem>

              </Select>
            </FormControl>
            <TextField
              className={classes.input}
              id="price"
              label="Price"
              disabled={disabled}
              type="number"
              value={paper.price}
              onChange={(e) => handleChange({ price: Number(e.target.value) })}
            />
            {paper && paper.id && (
            <div>
              <Button onClick={fetchTopMarks}>Show Top Marks</Button>
              {reports.sort((a, b) => b.marks - a.marks).map((rep) => (
                <div className={classes.marks}>
                  <span>{rep.name}</span>
                  <span>{rep.ownerEmail}</span>
                  <span>
                    {rep.marks}
                    %
                  </span>
                </div>
              ))}
            </div>
            )}
            <div
              className={classes.addRemove}
            >
              <AddCircleOutlineIcon
                fontSize="large"
                onClick={addQuestion}
              />
              <RemoveCircleOutlineIcon
                fontSize="large"
                onClick={removeQuestion}
              />
              <FileUploader
                ref={fileRef}
                disabled={disabled}
                fileType={FileType.PDF}
                onSuccess={handleSuccess}
                fileName={paper.pdfId}
              />

            </div>
            <Button
              disabled={disabled}
              variant="contained"
              onClick={validate}
              color="primary"
              style={{ width: '150px' }}
            >
              Save Paper
            </Button>
          </div>

          <div className={classes.questions}>
            {
              paper?.answers.map((q, idx) => (
                <div
                  className={classes.question}
                  key={idx}
                >
                  <MCQAnswer
                    idx={idx}
                    status={Status.Correct}
                    ans={q.ans}
                    possibleAnswers={paper.possibleAnswers}
                    onSelectAnswer={(idx, ans) => {
                      setPaper((prev) => {
                        const clone = { ...prev };
                        clone.answers[idx].ans = ans;
                        return clone;
                      });
                    }}
                  />
                </div>
              ))
            }
          </div>
        </div>
        <div>
          {paper.pdfURL && <PDFView url={paper.pdfURL} />}
          <LessonList
            entity={Entity.LESSONS_PAPER}
            courseId={courseId}
            onLessonSelect={(e) => clickEdit(e as IPaperLesson)}
            lastUpdated={lastUpdated}
          />
        </div>
      </div>

    </>
  );
};
