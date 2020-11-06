import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import classes from './Storage.module.scss';
import {
  deleteVideo, Entity, getDocsWithProps, listAllVideos,
} from '../../../data/Store';
import { IVideoLesson } from '../../../interfaces/ILesson';
import { ITeacher } from '../../../interfaces/ITeacher';
import { useForcedUpdate } from '../../../hooks/useForcedUpdate';

export const Storage = () => {
  const [vds, setVds] = useState<{tId: string; vidId: string}[]>([]);
  const [onUpdate, rerender] = useForcedUpdate();

  return (
    <>
      <div className={classes.root}>
        {
          vds.map((v) => (
            <div key={v.tId + v.vidId}>
              <span>{v.tId}</span>
              <span>{v.vidId}</span>
              <Button
                onClick={() => deleteVideo(v.tId, v.vidId).then(() => rerender())}
              >
                Delete

              </Button>
            </div>
          ))
        }
      </div>
    </>
  );
};
