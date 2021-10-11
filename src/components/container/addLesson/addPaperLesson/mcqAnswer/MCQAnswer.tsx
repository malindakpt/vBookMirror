import {
  FormControl, InputLabel, MenuItem, Select,
} from '@material-ui/core';
import React from 'react';
import classes from './MCQAnswer.module.scss';

export enum Status {
  Correct, Wrong, Unknown
}
interface Props {
  idx: number;
  ans: string;
  possibleAnswers: string[];
  status: Status;
  onSelectAnswer: (idx: number, ans: string) => void;
}

export const MCQAnswer: React.FC<Props> = ({
  idx, ans, possibleAnswers, onSelectAnswer, status,
}) => (
  <FormControl className={classes.container}>
    <div className={`${classes.section2} ${status
      === Status.Correct && classes.correct} ${status === Status.Wrong && classes.wrong}`}>
      <h3>
        {idx + 1}
      </h3>
      <div>
        <InputLabel
          id="demo-simple-select-label"
          className={classes.label}
        >
          Select Answer
        </InputLabel>
        <Select
          className={classes.w100}
          labelId="label1"
          id="id1"
          value={ans}
          onChange={(e) => onSelectAnswer(idx, e.target.value as string)}
        >
          <MenuItem
            value="0"
            key="0"
          >
            ---
          </MenuItem>
          {
            possibleAnswers.map((ans) => (
              <MenuItem
                value={ans}
                key={ans}
              >
                {`${ans}`}
              </MenuItem>
            ))
          }

        </Select>
      </div>
    </div>
  </FormControl>
);
