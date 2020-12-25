import {
  FormControl, InputLabel, MenuItem, Select, TextField,
} from '@material-ui/core';
import React from 'react';
import { VideoType, VideoUrlsObj } from '../../../interfaces/ILesson';
import classes from './AddVideo.module.scss';

interface Props {
  disabled: boolean;
  videoUrls: VideoUrlsObj;
  onChange: (videoUrls: VideoUrlsObj)=> void;
}

export const AddVideo: React.FC<Props> = ({ disabled, videoUrls, onChange }) => {
  const onChangeValues = (obj: any) => {
    onChange({ ...videoUrls, ...obj });
  };

  return (
    <div className={classes.container}>
      <FormControl className={classes.input}>
        <InputLabel
          id="demo-simple-select-label"
          className="fc1"
        >
          Select Active Vide
        </InputLabel>
        <Select
          className={`${classes.input}`}
          labelId="label1"
          id="id1"
          value={videoUrls.activeVideo}
          onChange={(e) => onChangeValues({ activeVideo: e.target.value as string })}
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
      {videoUrls.activeVideo === VideoType.GoogleDrive
        && (
        <TextField
          className={classes.input}
          id="1"
          label="Video URL(Drive Embed)"
          value={videoUrls[VideoType.GoogleDrive]}
          disabled={disabled}
          onChange={(e) => onChangeValues({ [VideoType.GoogleDrive]: e.target.value })}
        />
        )}

      {videoUrls.activeVideo === VideoType.MediaFire
        && (
        <TextField
          className={classes.input}
          id="2"
          label="Video URL(MediaFire Embed)"
          value={videoUrls[VideoType.MediaFire]}
          disabled={disabled}
          onChange={(e) => onChangeValues({ [VideoType.MediaFire]: e.target.value })}
        />
        )}
    </div>
  );
};
