import {
  Divider, List, ListItem, ListItemText,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { AppContext } from '../../../App';
import {
  deleteDoc, Entity, getDocsWithProps, updateDoc,
} from '../../../data/Store';
import { ICourse } from '../../../interfaces/ICourse';
import { ILesson } from '../../../interfaces/ILesson';
import classes from './LessonList.module.scss';
import { useForcedUpdate } from '../../../hooks/useForcedUpdate';

interface Props {
    entity: Entity;
    course: ICourse | null;
    onLessonSelect: (lesson: ILesson)=> void;
}
export const LessonList: React.FC<Props> = ({
  course, entity, onLessonSelect,
}) => {
  const { email, showSnackbar } = useContext(AppContext);
  const [courseLessons, setCourseLessons] = useState<ILesson[]>([]);
  const [courseOrderChanged, setCourseOrderChaged] = useState<boolean>(false);
  const [onUpdate, forcedUpdate] = useForcedUpdate();

  useEffect(() => {
    if (!course) {
      return;
    }
    getDocsWithProps<ILesson[]>(entity,
      { ownerEmail: email, courseId: course.id }).then((lessons) => {
      setCourseLessons(lessons.sort((a, b) => a.orderIndex - b.orderIndex));
    });
  }, [onUpdate, course, email, entity]);

  const saveLessonsOrder = () => {
    courseLessons.forEach((lesson, idx) => {
      updateDoc(entity, lesson.id, { orderIndex: idx });
    });
    setCourseOrderChaged(false);
  };

  const deleteItem = (lesson: ILesson) => {
    // eslint-disable-next-line no-restricted-globals
    const r = confirm(`Are you sure?  ${lesson.topic} will be deleted permenantly`);
    if (r === true) {
      deleteDoc(entity, lesson.id).then(() => {
        showSnackbar(`${lesson.topic} removed`);
        forcedUpdate();
      });
    }
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
            <ArrowDropUpIcon onClick={(e) => {
              changeOrder(index, true); e.stopPropagation();
            }}
            />
            )}
            {index < courseLessons.length - 1 && (
            <ArrowDropDownIcon
              onClick={(e) => { changeOrder(index, false); e.stopPropagation(); }}
            />

            )}
            <DeleteForeverIcon
              onClick={(e) => { deleteItem(lesson); e.stopPropagation(); }}
            />
          </ListItem>
          <Divider />
        </div>
      ))
    }
      </List>
    </div>
  );
};
