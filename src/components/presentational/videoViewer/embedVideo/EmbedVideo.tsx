import React from 'react';
import classes from './EmbedVideo.module.scss';

interface Props {
    videoUrl: string;
}
export const EmbedVideo: React.FC<Props> = ({ videoUrl }) => (
  <div className={classes.container}>
    <iframe
      title="embedvideo"
      className={classes.frame}
      src={videoUrl}
      frameBorder="0"
      width="100%"
      height="100%"
      allowFullScreen
      allow="autoplay"
    />
  </div>
);
