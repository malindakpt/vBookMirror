/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useEffect, useState } from 'react';
// import classes from './GoogleDriveVideo.module.scss';

interface Props {
    videoUrl: string;
}
export const FileVideo: React.FC<Props> = ({ videoUrl }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (videoUrl?.length > 5) {
      setUrl(videoUrl);
    }
  }, [videoUrl]);
  return (
    <div>
      { url === '' ? 'Please wait....'
        : (
          <video
            width="100%"
            controls
            controlsList="nodownload"
          >
            <track kind="captions" />
            <source
              src={videoUrl}
              type="video/mp4"
            />
          </video>
        )}

    </div>
  );
};
