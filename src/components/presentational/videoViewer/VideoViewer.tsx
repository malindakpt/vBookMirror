import React from 'react';
import { ILesson, VideoType, VideoUrlsObj } from '../../../interfaces/ILesson';

interface Props {
    lesson: ILesson;
}
export const VideoViewer: React.FC<Props> = ({ lesson }) => {
  // const { activeVideo, googleDrive, mediaFire } = lesson.videoUrls;
  const getVideo = (videoUrl: VideoUrlsObj) => {
    switch (videoUrl.activeVideo) {
      case VideoType.GoogleDrive:
        return (
          <div>
            Drive Video
            {' '}
            {videoUrl.googleDrive}
          </div>
        );
      case VideoType.MediaFire:
        return (
          <div>
            MF Video
            {' '}
            {videoUrl.mediaFire}
          </div>
        );

      default:
        return <div>No Video</div>;
    }
  };

  return (
    <div>
      Video Viewer
      {lesson.videoUrls?.map((videoUrl) => getVideo(videoUrl))}
    </div>
  );
};
