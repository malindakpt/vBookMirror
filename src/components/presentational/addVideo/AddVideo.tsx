import {
  Button,
  FormControl, InputLabel, MenuItem, Select, TextField,
} from '@material-ui/core';
import React from 'react';
import { emptyVideoObj, VideoType, VideoUrlsObj } from '../../../interfaces/ILesson';
import classes from './AddVideo.module.scss';

interface Props {
  title?: string;
  disabled: boolean;
  videoUrls: VideoUrlsObj[];
  onChange: (videoUrls: VideoUrlsObj[]) => void;
  allowAddNew?: boolean;
}

export const AddVideo: React.FC<Props> = ({
  disabled, videoUrls, onChange, title, allowAddNew,
}) => {
  const onChangeArrayValues = (index: number, obj: any) => {
    videoUrls[index] = { ...videoUrls[index], ...obj };
    onChange(videoUrls);
  };

  const addNewVideo = () => {
    videoUrls.push(emptyVideoObj);
    onChange(videoUrls);
  };

  return (
    <div>
      <div>
        {videoUrls && videoUrls.map((videoUrl, index) => (
          <div
            className={classes.container}
            // This does not have any other unique property
            // eslint-disable-next-line react/no-array-index-key
            key={index}
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
                disabled={disabled}
                labelId="label1"
                id="id1"
                value={videoUrl.activeVideo}
                onChange={(e) => onChangeArrayValues(index, { activeVideo: e.target.value as string })}
              >
                <MenuItem
                  value={VideoType.None}
                  key={VideoType.None}
                >
                  No Video
                </MenuItem>
                <MenuItem
                  value={VideoType.YoutubeVideo}
                  key={VideoType.YoutubeVideo}
                >
                  Youtube
                </MenuItem>
                <MenuItem
                  value={VideoType.GoogleDrive}
                  key={VideoType.GoogleDrive}
                >
                  GoogleDrive
                </MenuItem>
                <MenuItem
                  value={VideoType.FileVideo}
                  key={VideoType.FileVideo}
                >
                  File Video
                </MenuItem>
                <MenuItem
                  value={VideoType.EmbedVideo}
                  key={VideoType.EmbedVideo}
                >
                  Embed Video
                </MenuItem>
              </Select>
            </FormControl>

            {videoUrl.activeVideo !== VideoType.None && (
              <TextField
                className={classes.input}
                id="1"
                label="Video Sub Description"
                value={videoUrl.description}
                disabled={disabled}
                onChange={(e) => onChangeArrayValues(index, { description: e.target.value })}
              />
            )}

            {videoUrl.activeVideo === VideoType.GoogleDrive
              && (
                <TextField
                  className={classes.input}
                  id="2"
                  label="Video URL(Drive Embed)"
                  value={videoUrl.googleDrive}
                  disabled={disabled}
                  onChange={(e) => onChangeArrayValues(index, { googleDrive: e.target.value })}
                />
              )}

            {videoUrl.activeVideo === VideoType.FileVideo
              && (
                <TextField
                  className={classes.input}
                  id="3"
                  label="Video download URL"
                  value={videoUrl.fileVideo}
                  disabled={disabled}
                  onChange={(e) => onChangeArrayValues(index, { fileVideo: e.target.value })}
                />
              )}

            {videoUrl.activeVideo === VideoType.EmbedVideo
              && (
                <TextField
                  className={classes.input}
                  id="4"
                  label="Embed src link"
                  value={videoUrl.embedVideo}
                  disabled={disabled}
                  onChange={(e) => onChangeArrayValues(index, { embedVideo: e.target.value })}
                />
              )}

            {videoUrl.activeVideo === VideoType.YoutubeVideo && (
              <TextField
                className={classes.input}
                id="1"
                label="Youtube Video Id"
                value={videoUrl.youtubeVideo}
                disabled={disabled}
                onChange={(e) => onChangeArrayValues(index, { youtubeVideo: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>
      {allowAddNew && <Button disabled={disabled} onClick={addNewVideo}>Add More Video</Button>}
    </div>
  );
};
