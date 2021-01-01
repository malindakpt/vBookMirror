import { Button } from '@material-ui/core';
import React, { useRef } from 'react';
import YouTube from 'react-youtube';
import classes from './YoutubeVideo.module.scss';

interface Props {
  videoUrl: string;
}
export const YoutubeVideo: React.FC<Props> = ({ videoUrl }) => {

  const target = useRef<any>();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {videoUrl?.length > 3 &&
          <YouTube
            videoId={videoUrl}
            className={classes.player}
            onReady={(e) => {
              target.current = e.target;
            }}
          />}
          <div className={classes.cover1} />
      </div>
      <div className={classes.buttons}>
        <Button onClick={() => target.current.playVideo()}>Play</Button>
        <Button onClick={() => target.current.pauseVideo()}>Pause</Button>
        <Button onClick={() => target.current.stopVideo()}>Stop</Button>
      </div>
    </div>
  )
};
