import React from 'react';
import { ILesson } from '../../../interfaces/ILesson';
import classes from './Attachments.module.scss';

interface Props {
    lesson: ILesson|undefined;
}
export const Attachments: React.FC<Props> = ({ lesson }) => (
  <div className={classes.attachments}>
    {lesson?.attachments && lesson.attachments.length > 0 && (
    <div>
      පාඩමට අදාළ  PDF  පහතින් download කරගන්න.
      {lesson.attachments.map((atta: string) => (
        <li key={atta}>
          <a
            href={atta}
            rel="noopener noreferrer"
            target="_blank"
          >
            {atta}
          </a>
        </li>
      ))}
    </div>
    )}
  </div>
);
