import React, {
  useState, useEffect, useContext,
} from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import classes from './AddMCQ.module.scss';
import { IMCQQuestion } from '../../../../interfaces/IPaper';
import { AddMCQQuestion } from './addMCQQuestion/AddMCQQuestion';

export const AddMCQ = () => {
  const add = 'a';
  const [questions, setQuestions] = useState<IMCQQuestion[]>([]);

  const addQuestion = () => {
    const ans = {
      imgUrl: '',
      isCorrect: false,
      text: '',
    };
    const question: IMCQQuestion = {
      text: '',
      answers: [ans, ans, ans, ans, ans],
      imageUrl: '',
    };
    setQuestions((prev) => {
      const clone = [...prev, question];
      return clone;
    });
  };
  return (
    <div className={classes.container}>

      <div
        className={classes.add}
      >
        <AddCircleOutlineIcon
          fontSize="large"
          onClick={addQuestion}
        />
      </div>

      {
          questions.map((q) => (
            <div className={classes.question}>
              <AddMCQQuestion mcqQuestion={q} />
              <DeleteForeverIcon />
            </div>
          ))
        }
    </div>
  );
};
