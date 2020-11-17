import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import {
  Button, FormControl, FormControlLabel, InputLabel, List, ListItem, ListItemText, MenuItem, Radio, RadioGroup, Select, TextField,
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SaveIcon from '@material-ui/icons/Save';
import classes from './AddMCQ.module.scss';
import { MCQAnswer } from './mcqAnswer/MCQAnswer';
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
import { IPaper, PaperType } from '../../../../interfaces/ILesson';

export const AddMCQ = () => {
  const { email, showSnackbar } = useContext(AppContext);
  const childRef = useRef<any>();
  const newPaper: IPaper = {
    id: '',
    attachments: [],
    duration: 0,
    keywords: '',
    createdAt: 0,
    courseId: '',
    orderIndex: 0,
    answers: [],
    price: 0,
    possibleAnswers: ['1', '2', '3', '4', '5'],
    topic: '',
    description: '',
    type: PaperType.MCQ,
    pdfURL: '',
    pdfId: `${new Date().getTime()}`,
    ownerEmail: email || '',
  };
  const [allPapers, setAllPapers] = useState<IPaper[]>([]);
  const [busy, setBusy] = useState<boolean>(false);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [paper, setPaper] = useState<IPaper>(newPaper);
  const [courseOrderChanged, setCourseOrderChaged] = useState<boolean>(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [courseId, setCourseId] = useState<string>('');

  const [exams, setExams] = useState<IExam[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  const addNew = () => {
    setPaper(newPaper);
    setEditMode(false);
  };

  const beforeAdd = () => {
    paper.courseId = courseId;
    paper.pdfId = `${new Date().getTime()}`;
    paper.orderIndex = allPapers.length;
  };

  const loadPapers = () => {
    getDocsWithProps<IPaper[]>(Entity.PAPER_MCQ, { ownerEmail: email, courseId })
      .then((papers) => {
        papers && setAllPapers(papers);
      });
  };
  const initData = () => {
    getDocsWithProps<ICourse[]>(Entity.COURSES, { ownerEmail: email })
      .then((courses) => {
        courses && setCourses(courses);
      });
    // eslint-disable-next-line
    addNew();
  };

  useEffect(() => {
    initData();
    // fetch unrelated data
    getDocsWithProps<ISubject[]>(Entity.SUBJECTS, {}).then((data) => setSubjects(data));
    getDocsWithProps<IExam[]>(Entity.EXAMS, {}).then((data) => setExams(data));
    // eslint-disable-next-line
  }, []);

  const disabled = !courseId;

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

  const handleSuccess = (fileRef: string|null) => {
    // const clone = { ...paper };

    if (isEditMode) {
      if (fileRef) {
        paper.pdfURL = fileRef;
      } else {
        // No need to set ref
      }
    } else {
      if (!fileRef) {
        showSnackbar('Upload file not found');
        return;
      }
      paper.pdfURL = fileRef;
    }

    if (isEditMode) {
      updateDoc(Entity.PAPER_MCQ, paper.id, paper).then(() => {
        showSnackbar(`Edited: ${paper.topic}`);
        setEditMode(false);
        initData();
        setBusy(false);
        loadPapers();
      });
    } else {
      beforeAdd();
      addDoc<IPaper>(Entity.PAPER_MCQ, paper).then(() => {
        showSnackbar(`Added: ${paper.topic}`);
        initData();
        setBusy(false);
        loadPapers();
      });
    }
  };

  const onCourseChange = (_courseId: string) => {
    getDocsWithProps<IPaper[]>(Entity.PAPER_MCQ, { ownerEmail: email, courseId: _courseId })
      .then((papers) => {
        papers && setAllPapers(papers);
      });
    setCourseId(_courseId);
  };

  const clickEdit = (paper: IPaper) => {
    setPaper(paper);
    setEditMode(true);
  };

  const changeOrder = (index: number, isUp: boolean) => {
    const clone = [...allPapers];
    const nextIdx = isUp ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= allPapers.length) {
      return;
    }
    const item1 = { ...clone[index] };
    const item2 = { ...clone[nextIdx] };

    clone[index] = item2;
    clone[nextIdx] = item1;

    setCourseOrderChaged(true);

    clone.forEach((paper, idx) => {
      paper.orderIndex = idx;
    });
    setAllPapers(clone);
  };

  const saveLessonsOrder = () => {
    allPapers.forEach((paper, idx) => {
      updateDoc(Entity.PAPER_MCQ, paper.id, { orderIndex: idx });
      setCourseOrderChaged(false);
    });
  };

  const validate = () => {
    childRef?.current?.startUploading();
  };

  return (
    <div className={classes.container}>
      <div>

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

        <div className={classes.top}>
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
            onChange={(e) => {
              e.persist();
              setPaper((prev) => {
                const clone = { ...prev };
                clone.topic = e.target.value;
                return clone;
              });
            }}
          />
          <TextField
            className={classes.input}
            id="description"
            label="Description"
            disabled={disabled}
            value={paper.description}
            inputProps={{ maxLength: 120 }}
            onChange={(e) => {
              e.persist();
              setPaper((prev) => {
                const clone = { ...prev };
                clone.description = e.target.value;
                return clone;
              });
            }}
          />
          <TextField
            className={classes.input}
            id="price"
            label="Price"
            disabled={disabled}
            type="number"
            value={paper.price}
            onChange={(e) => {
              e.persist();
              setPaper((prev) => {
                const clone = { ...prev };
                clone.price = Number(e.target.value);
                return clone;
              });
            }}
          />

        </div>
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
            ref={childRef}
            disabled={disabled}
            fileType={FileType.PDF}
            onSuccess={handleSuccess}
            fileName={paper.pdfId}
          />
          <Button
            disabled={disabled}
            variant="contained"
            onClick={validate}
          >
            Save
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
              allPapers.sort((a, b) => a.orderIndex - b.orderIndex).map((paper, index) => (

                <ListItem
                  button
                  onClick={() => { clickEdit(paper); }}
                  key={paper.id}
                  className={classes.paperList}
                >
                  {paper.topic}

                  <div>
                    {index > 0 && (
                    <ArrowUpwardIcon onClick={(e) => {
                      changeOrder(index, true); e.stopPropagation();
                    }}
                    />
                    )}
                    {index < allPapers.length - 1 && (
                    <ArrowDownwardIcon
                      onClick={(e) => { changeOrder(index, false); e.stopPropagation(); }}
                    />
                    )}
                  </div>
                </ListItem>
              ))
            }
          </List>
        </div>
      </div>
    </div>
  );
};
