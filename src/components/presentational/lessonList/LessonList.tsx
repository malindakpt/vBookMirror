import {
  Divider, List, ListItem, ListItemText,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { AppContext } from '../../../App';
import { Entity, getDocsWithProps, updateDoc } from '../../../data/Store';
import { ICourse } from '../../../interfaces/ICourse';
import { ILesson } from '../../../interfaces/ILesson';
import classes from './LessonList.module.scss';

interface Props {
    entity: Entity;
    course: ICourse | null;
    onLessonSelect: (lesson: ILesson)=> void;
}
export const LessonList: React.FC<Props> = ({
  course, entity, onLessonSelect,
}) => {
  const { showSnackbar, email } = useContext(AppContext);
  const [courseLessons, setCourseLessons] = useState<ILesson[]>([]);
  const [courseOrderChanged, setCourseOrderChaged] = useState<boolean>(false);

  useEffect(() => {
    if (!course) {
      return;
    }
    getDocsWithProps<ILesson[]>(entity,
      { ownerEmail: email, courseId: course.id }).then((lessons) => {
      setCourseLessons(lessons.sort((a, b) => a.orderIndex - b.orderIndex));
    });
  }, [course]);

  const saveLessonsOrder = () => {
    courseLessons.forEach((lesson, idx) => {
      updateDoc(entity, lesson.id, { orderIndex: idx });
    });
    setCourseOrderChaged(false);
  };

  const changeOrder = (index: number, isUp: boolean) => {
    const clone = [...courseLessons];
    const nextIdx = isUp ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= courseLessons.length) {
      return;
    }
    const item1 = { ...clone[index] };
    const item2 = { ...clone[nextIdx] };

    clone[index] = item2;
    clone[nextIdx] = item1;

    setCourseOrderChaged(true);

    clone.forEach((lesson, idx) => {
      lesson.orderIndex = idx;
    });
    setCourseLessons(clone);
  };

  return (
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
      courseLessons.map((lesson, index) => (
        <div
        // TODO: refresh on lesson add. do not local update
        // c.id becomes undefined for newly added lesson since we refer that from local
          key={lesson.id}
        >
          <ListItem
            button
            // onClick={() => { setEditMode(true); setSelectedLesson(lesson); }}
            onClick={() => onLessonSelect(lesson)}
          >
            <div
              className="fc1"
              style={{ fontSize: '11px', width: '100%' }}
            >
              {lesson.topic}
            </div>

            {index > 0 && (
            <ArrowUpwardIcon onClick={(e) => {
              changeOrder(index, true); e.stopPropagation();
            }}
            />
            )}
            {index < courseLessons.length - 1 && (
            <ArrowDownwardIcon
              onClick={(e) => { changeOrder(index, false); e.stopPropagation(); }}
            />
            )}
          </ListItem>
          <Divider />
        </div>
      ))
    }
      </List>
    </div>
  );
};
