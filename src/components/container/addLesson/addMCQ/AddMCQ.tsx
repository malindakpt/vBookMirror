import React, {
  useState, useEffect, useContext,
} from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { Button, TextField } from '@material-ui/core';
import classes from './AddMCQ.module.scss';
import { IMCQAnswer, IPaper, PaperType } from '../../../../interfaces/IPaper';
import { MCQAnswer } from './mcqAnswer/MCQAnswer';

export const AddMCQ = () => {
  const [paper, setPaper] = useState<IPaper>({
    id: '',
    createdAt: 0,

    asnwers: [],
    possibleAnswers: ['1', '2', '3', '4', '5'],
    topic: '',
    description: '',
    type: PaperType.MCQ,
    srcURL: '',
  });

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

  const saveChanges = () => {
    console.log(paper);
  };

  return (
    <div className={classes.container}>
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
        <Button
          variant="contained"
          onClick={saveChanges}
        >
          Save Changes
        </Button>
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
  );
};
