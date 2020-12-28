import React from 'react';
import { ILesson, VideoType, VideoUrlsObj } from '../../../interfaces/ILesson';
import { FileVideo } from './fileVideo/FileVideo';
import { GoogleDriveVideo } from './googleDriveVideo/GoogleDriveVideo';
import classes from './VideoViewer.module.scss';

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
      case VideoType.FileVideo:
        return (
          <FileVideo videoUrl={videoUrl.fileVideo} />
        );

      default:
        return <div>No Video</div>;
    }
  };

  return (
    <div>
      Video Viewer
      {lesson.videoUrls?.map((videoUrl) => (
        <div key={videoUrl.googleDrive + videoUrl.fileVideo + videoUrl.description}>
          <div className={classes.subTitle}>{videoUrl.description}</div>
          {getVideo(videoUrl)}
        </div>
      ))}
    </div>
  );
};
