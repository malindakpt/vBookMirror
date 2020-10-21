import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import classes from './Storage.module.scss';
import { deleteVideo, getDocsWithProps, listAllVideos } from '../../../data/Store';
import { ILesson } from '../../../interfaces/ILesson';
import { ITeacher } from '../../../interfaces/ITeacher';
import { useForcedUpdate } from '../../../hooks/useForcedUpdate';

export const Storage = () => {
  const [vds, setVds] = useState<{tId: string; vidId: string}[]>([]);
  const [onUpdate, rerender] = useForcedUpdate();

  useEffect(() => {
    setVds([]);
    getDocsWithProps<ILesson[]>('lessons', {}).then((lessons) => {
      getDocsWithProps<ITeacher[]>('teachers', {}).then((teachers) => {
        teachers.forEach((teacher) => {
          listAllVideos(teacher.ownerEmail).then((videos) => {
            videos?.items.forEach((vid) => {
              const videoId = vid.fullPath.split('/')[2];
              const lessonExists = lessons.findIndex((les) => les.videoId === videoId) > -1;
              if (!lessonExists) {
                setVds((prev) => {
                  const clone = [...prev];
                  clone.push({
                    tId: teacher.id,
                    vidId: videoId,
                  });
                  return clone;
                });
              }
            });
          });
        });
      });
    });
    // eslint-disable-next-line
  }, [onUpdate]);

  return (
    <>
      <div className={classes.root}>
        {
          vds.map((v) => (
            <div key={v.tId + v.vidId}>
              <span>{v.tId}</span>
              <span>{v.vidId}</span>
              <Button onClick={() => deleteVideo(v.tId, v.vidId).then(() => rerender())}>Delete</Button>
            </div>
          ))
        }
      </div>
    </>
  );
};
