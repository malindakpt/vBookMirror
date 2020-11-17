/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState } from 'react';
import classes from './Player.module.scss';

interface Props {
    videoUrl: string;
}

export const Player: React.FC<Props> = ({ videoUrl }) => {
  const [isFull, setFull] = useState<boolean>(false);

  return (
    <div className={isFull ? classes.full : classes.small}>
      <div
        className={classes.playerHead}
        role="button"
        onKeyDown={() => {}}
        onClick={(e) => {
          setFull((prev) => !prev);
          e.stopPropagation();
        }}
      >
        .
      </div>
      <iframe
        className={classes.player}
        title="video"
        src={videoUrl}
      />
    </div>
  );
};
