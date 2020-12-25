import React from 'react';
import { ILesson, VideoType } from '../../../interfaces/ILesson';

interface Props {
    lesson: ILesson;
}
export const VideoViewer: React.FC<Props> = ({ lesson }) => {
  const { activeVideo, googleDrive, mediaFire } = lesson.videoUrls;
  const getVideo = () => {
    switch (activeVideo) {
      case VideoType.GoogleDrive:
        return (
          <div>
            Drive Video
            {' '}
            {googleDrive}
          </div>
        );
      case VideoType.MediaFire:
        return (
          <div>
            MF Video
            {' '}
            {mediaFire}
          </div>
        );

      default:
        return <div>No Video</div>;
    }
  };

  return (
    <div>
      Video Viewer
      {getVideo()}
    </div>
  );
};
