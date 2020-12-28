import React from 'react';
import { ILesson, VideoType, VideoUrlsObj } from '../../../interfaces/ILesson';
import { GoogleDriveVideo } from './googleDriveVideo/GoogleDriveVideo';

interface Props {
    lesson: ILesson;
}
export const VideoViewer: React.FC<Props> = ({ lesson }) => {
  const getVideo = (videoUrl: VideoUrlsObj) => {
    switch (videoUrl.activeVideo) {
      case VideoType.GoogleDrive:
        return (
          <GoogleDriveVideo videoUrl={videoUrl.googleDrive} />
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
