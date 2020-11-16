import React, { useContext, useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { List, ListItem, TextField } from '@material-ui/core';
import classes from './AddMCQ.module.scss';
import { IPaper, PaperType } from '../../../../interfaces/IPaper';
import { MCQAnswer } from './mcqAnswer/MCQAnswer';
import { FileUploader } from '../../../presentational/fileUploader/FileUploader';
import {
  addDoc, Entity, FileType, getDocsWithProps,
} from '../../../../data/Store';
import { PDFView } from '../../../presentational/pdfView/PDFView';
import { AppContext } from '../../../../App';

export const AddMCQ = () => {
  const { email } = useContext(AppContext);

  const [allPapers, setAllPapers] = useState<IPaper[]>([]);
  const [isEditMode, setEditMode] = useState<boolean>(false);

  const newPaper: IPaper = {
    id: '',
    createdAt: 0,

    asnwers: [],
    price: 0,
    possibleAnswers: ['1', '2', '3', '4', '5'],
    topic: '',
    description: '',
    type: PaperType.MCQ,
    pdfURL: '',
    pdfId: `${new Date().getTime()}`,
    ownerEmail: email || '',
  };

  useEffect(() => {
    getDocsWithProps<IPaper[]>(Entity.PAPER_MCQ, { ownerEmail: email })
      .then((papers) => {
        papers && setAllPapers(papers);
      });
  }, []);

  const [paper, setPaper] = useState<IPaper>(newPaper);

  const addNew = () => {
    newPaper.pdfId = `${new Date().getTime()}`;
    setPaper(newPaper);
  };

  const addQuestion = () => {
    setPaper((prev) => {
      const clone = { ...prev };
      clone.asnwers = [...clone.asnwers, { ans: '0' }];
      return clone;
    });
  };

  const removeQuestion = () => {
    setPaper((prev) => {
      const clone = { ...prev };
      clone.asnwers.splice(clone.asnwers.length - 1, 1);
      return clone;
    });
  };

  const disabled = () => {
    if (paper.topic?.length > 2 && paper.description?.length > 2) {
      return false;
    }
    return true;
  };

  const saveChanges = (fileRef: string) => {
    setPaper((prev) => {
      const clone = { ...prev };
      clone.pdfURL = fileRef;

      addDoc<IPaper>(Entity.PAPER_MCQ, clone).then(() => {
        console.log(`Added: ${paper}`);
      });

      return clone;
    });
  };

  const clickEdit = (paper: IPaper) => {
    setPaper(paper);
    setEditMode(true);
  };

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.top}>
          <TextField
            id="topic"
            label="Topic"
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
            disabled={disabled()}
            fileType={FileType.PDF}
            onSuccess={(fileRef: string) => saveChanges(fileRef)}
            fileName={paper.pdfId}
          />

        </div>
        <div className={classes.questions}>
          {
        paper?.asnwers.map((q, idx) => (
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
                  clone.asnwers[idx].ans = ans;
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
            {
              allPapers.map((paper) => (

                <ListItem
                  button
                  onClick={() => { clickEdit(paper); }}
                  key={paper.id}
                >
                  {paper.topic}
                </ListItem>
              ))
            }
          </List>
        </div>
      </div>
    </div>
  );
};
