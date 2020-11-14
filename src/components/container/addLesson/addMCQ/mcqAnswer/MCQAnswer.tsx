import {
  FormControl, InputLabel, MenuItem, Select, TextField,
} from '@material-ui/core';
import React, { useState } from 'react';
import { IMCQAnswer } from '../../../../../interfaces/IPaper';
import classes from './MCQAnswer.module.scss';

interface Props {
    idx: number;
    ans: string;
    possibleAnswers: string[];
    onSelectAnswer: (idx:number, ans: string) => void;
}

export const MCQAnswer: React.FC<Props> = ({
  idx, ans, possibleAnswers, onSelectAnswer,
}) => (
  <FormControl className={classes.container}>
    <div className={classes.section2}>
      <h3>
        {idx}
      </h3>
      <div>
        <InputLabel
          id="demo-simple-select-label"
          className={classes.label}
        >
          Select Answer
        </InputLabel>
        <Select
          className="w100"
          labelId="label1"
          id="id1"
          value={ans}
          onChange={(e) => onSelectAnswer(idx, e.target.value as string)}
        >
          <MenuItem
            value="0"
            key="0"
          >
            Not Selected
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
