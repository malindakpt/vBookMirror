import {
  FormControl, InputLabel, MenuItem, Select, TextField,
} from '@material-ui/core';
import React from 'react';
import { VideoType, VideoUrlsObj } from '../../../interfaces/ILesson';
import classes from './AddVideo.module.scss';

interface Props {
  title?: string;
  disabled: boolean;
  videoUrls: VideoUrlsObj[];
  onChange: (videoUrls: VideoUrlsObj[])=> void;
}

export const AddVideo: React.FC<Props> = ({
  disabled, videoUrls, onChange, title,
}) => {
  const onChangeValues = (index: number, obj: any) => {
    videoUrls[index] = { ...videoUrls[index], ...obj };
    onChange(videoUrls);
  };

  return (
    <div>
      {videoUrls && videoUrls.map((videoUrl, index) => (
        <div
          className={classes.container}
          key={videoUrl.googleDrive + videoUrl.mediaFire}
        >
          <FormControl className={classes.input}>
            <InputLabel
              id="demo-simple-select-label"
              className="fc1"
            >
              {title}
              {' '}
              Video
            </InputLabel>
            <Select
              className={`${classes.input}`}
              labelId="label1"
              id="id1"
              value={videoUrl.activeVideo}
              onChange={(e) => onChangeValues(index, { activeVideo: e.target.value as string })}
            >
              <MenuItem
                value={VideoType.None}
                key={VideoType.None}
              >
                No Video
              </MenuItem>
              <MenuItem
                value={VideoType.GoogleDrive}
                key={VideoType.GoogleDrive}
              >
                GoogleDrive
              </MenuItem>
              <MenuItem
                value={VideoType.MediaFire}
                key={VideoType.MediaFire}
              >
                MediaFire
              </MenuItem>
            </Select>
          </FormControl>
          {videoUrl.activeVideo === VideoType.GoogleDrive
        && (
        <TextField
          className={classes.input}
          id="1"
          label="Video URL(Drive Embed)"
          value={videoUrl.googleDrive}
          disabled={disabled}
          onChange={(e) => onChangeValues(index, { googleDrive: e.target.value })}
        />
        )}

          {videoUrl.activeVideo === VideoType.MediaFire
        && (
        <TextField
          className={classes.input}
          id="2"
          label="Video URL(MediaFire Embed)"
          value={videoUrl.mediaFire}
          disabled={disabled}
          onChange={(e) => onChangeValues(index, { mediaFire: e.target.value })}
        />
        )}
        </div>
      ))}

    </div>
  );
};
