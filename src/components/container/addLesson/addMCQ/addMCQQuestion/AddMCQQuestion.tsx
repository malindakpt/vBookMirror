import { TextField } from '@material-ui/core';
import { PersonalVideo } from '@material-ui/icons';
import React, { useState } from 'react';
import { IMCQQuestion } from '../../../../../interfaces/IPaper';
import classes from './AddMCQQuestion.module.scss';

interface Props {
    mcqQuestion: IMCQQuestion;
}

export const AddMCQQuestion: React.FC<Props> = ({ mcqQuestion }) => {
  const q = 'as';

  const [ques, setQues] = useState<IMCQQuestion>(mcqQuestion);

  const setProps = (obj: any) => {
    setQues((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  return (
    <div className={classes.container}>
      <TextField
        className={classes.input}
        multiline
        rows={3}
        variant="outlined"
        id="text"
        label="Text"
        inputProps={{ maxLength: 240 }}
        value={mcqQuestion.text}
        onChange={(e) => setProps({ text: e.target.value })}
      />
      {
          ques?.answers.map((ans) => (
            <TextField
              className={classes.input}
              id="text"
              label="Text"
              inputProps={{ maxLength: 240 }}
              value={mcqQuestion.text}
              onChange={(e) => setProps({ text: e.target.value })}
            />
          ))
      }
    </div>
  );
};
