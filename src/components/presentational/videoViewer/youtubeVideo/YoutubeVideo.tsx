import React, { useRef, useState } from 'react';
import YouTube from 'react-youtube';
import classes from './YoutubeVideo.module.scss';
import { PlayArrow, Stop, Pause, Fullscreen } from '@material-ui/icons';

interface Props {
  videoUrl: string;
}
export const YoutubeVideo: React.FC<Props> = ({ videoUrl }) => {

  const target = useRef<any>();
  const [isFull, setFull] = useState(false);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {videoUrl?.length > 3 &&
          <YouTube
            videoId={videoUrl}
            className={isFull ? classes.full : classes.player}
            onReady={(e) => {
              target.current = e.target;
            }}
          />}
          <div className={isFull ? classes.fullCover : classes.cover1} />
      </div>
      <div className={ `${classes.buttons} ${isFull && classes.full}` } >
        <PlayArrow onClick={() => target.current.playVideo()}/>
        <Pause onClick={() => target.current.pauseVideo()}/>
        <Stop onClick={() => target.current.stopVideo()}/>
        <Fullscreen onClick={() => setFull(!isFull)}/>
      </div>
    </div>
  )
};
