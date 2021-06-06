import React from 'react';
import { ILesson, VideoType, VideoUrlsObj } from '../../../interfaces/ILesson';
import { EmbedVideo } from './embedVideo/EmbedVideo';
import { FileVideo } from './fileVideo/FileVideo';
import { GoogleDriveVideo } from './googleDriveVideo/GoogleDriveVideo';
import classes from './VideoViewer.module.scss';
import { YoutubeVideo } from './youtubeVideo/YoutubeVideo';

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

      case VideoType.EmbedVideo:
        return (
          <EmbedVideo videoUrl={videoUrl.embedVideo} />
        );

      case VideoType.YoutubeVideo:
        return (
          <YoutubeVideo videoUrl={videoUrl.youtubeVideo} />
        );

      default:
        return <div>No Video Found</div>;
    }
  };

  return (
    <div>
      {lesson.videoUrls?.reverse().map((videoUrl) => (
        <div key={videoUrl.googleDrive + videoUrl.fileVideo + videoUrl.description}>
          <div className={classes.subTitle}>{videoUrl.description}</div>
          {getVideo(videoUrl)}
        </div>
      ))}
    </div>
  );
};
