import React, { useRef, useState } from 'react';
import YouTube from 'react-youtube';
import {
  SkipPrevious, Fullscreen, FastForward, FastRewind,
} from '@material-ui/icons';
import classes from './YoutubeVideo.module.scss';

const VIDEO_SEEK_SECONDS = 120;
const YT_IS_PLAYING = 1;
interface Props {
  videoUrl: string;
}
export const YoutubeVideo: React.FC<Props> = ({ videoUrl }) => {
  const target = useRef<any>();
  const [isFull, setFull] = useState(false);
  const [isPlaying, setPlaying] = useState(false);

  const handleState = (e: any) => {
    if (target.current) {
      if (e.data === YT_IS_PLAYING) {
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    }
  };

  const handlePlay = (e: any) => {
    if (target.current) {
      if (isPlaying) {
        target.current.pauseVideo();
      } else {
        target.current.playVideo();
      }
    }
  };

  return (
    <div className={classes.root}>
      {videoUrl?.length > 3
          && (
          <>
            <div className={classes.container}>
              <YouTube
                videoId={videoUrl}
                className={isFull ? classes.full : classes.player}
                onReady={(e) => {
                  target.current = e.target;
                }}
            // onPlay={() => setPlaying(true)}
            // onPause={() => setPlaying(false)}                    // defaults -> noop
            // onEnd={() => setPlaying(false)}
                onStateChange={handleState}
              />
              <div
                className={isFull ? classes.fullCover : classes.cover1}
                role="button"
                onClick={handlePlay}
              />
            </div>
            <div className={`${classes.buttons} ${isFull && classes.full}`}>
              <SkipPrevious onClick={() => { target.current.seekTo(0, true); }} />
              <FastRewind onClick={() => target.current.seekTo(target.current.getCurrentTime() - VIDEO_SEEK_SECONDS, true)} />
              <FastForward onClick={() => target.current.seekTo(target.current.getCurrentTime() + VIDEO_SEEK_SECONDS, true)} />
              <Fullscreen onClick={() => setFull(!isFull)} />
            </div>
          </>
)}
    </div>
  );
};
