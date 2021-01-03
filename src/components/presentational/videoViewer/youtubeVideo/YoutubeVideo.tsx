import React, { useRef, useState } from 'react';
import YouTube from 'react-youtube';
import classes from './YoutubeVideo.module.scss';
import { Stop, Fullscreen } from '@material-ui/icons';

interface Props {
  videoUrl: string;
}
export const YoutubeVideo: React.FC<Props> = ({ videoUrl }) => {

  const target = useRef<any>();
  const [isFull, setFull] = useState(false);
  const [isPlaying, setPlaying] = useState(false);

  const handlePlay = () => {
    if (target.current) {
      if (isPlaying) {
        target.current.pauseVideo()
      } else {
        target.current.playVideo()
      }
    }
  }

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
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}                    // defaults -> noop
            onEnd={() => setPlaying(false)}
          />}
        <div className={isFull ? classes.fullCover : classes.cover1} role="button" onClick={handlePlay} />
      </div>
      <div className={`${classes.buttons} ${isFull && classes.full}`} >
        <Stop onClick={() => target.current.stopVideo()} />
        <Fullscreen onClick={() => setFull(!isFull)}/>
      </div>
    </div>
  )
};
