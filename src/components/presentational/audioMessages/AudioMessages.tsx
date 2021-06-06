import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classes from './AudioMessages.module.scss';
import { Entity, listenFileChanges } from '../../../data/Store';
import { IAudioQuestion } from '../../../interfaces/IAudioQuestion';
import { ILiveLesson } from '../../../interfaces/ILesson';
import askImage from '../../../images/ask.png';

export interface Props {
    lessonId: string
 }

export const AudioMessages: React.FC<Props> = ({ lessonId }) => {
  const audioQuestionsUnsubscribe = useRef<any>();
  const [readyToListenQuestions, setReadyToListenQuestions] = useState<boolean>(false);

  const [audioQuestions, setAudioQuestions] = useState<Record<string, IAudioQuestion>>({});
  const playedQuestions = useRef<Record<string, IAudioQuestion>>({});
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  const startListenAudioQuestions = useCallback(() => {
    if (!audioQuestionsUnsubscribe.current) {
      console.log('Subscribed to questions');
      audioQuestionsUnsubscribe.current = listenFileChanges<ILiveLesson>(Entity.LESSONS_LIVE, lessonId, (data) => {
        console.log('New questions', data);
        if (data && data.audioQuestions) {
          setAudioQuestions(data.audioQuestions);
          if (!readyToListenQuestions) {
            playedQuestions.current = (data.audioQuestions);
          }
        }

        if (!readyToListenQuestions) {
          setTimeout(() => {
            setReadyToListenQuestions(true);
          }, 3000);
        }
      });
    }
  }, [lessonId, readyToListenQuestions]);

  const addtoPlayedList = (key: string, audio: IAudioQuestion) => {
    playedQuestions.current[key] = audio;
    // eslint-disable-next-line no-new
    new Notification('New Question', { body: audio.studentName, icon: askImage });
  };

  useEffect(() => {
    startListenAudioQuestions();
  }, [startListenAudioQuestions]);

  // cleanup function
  useEffect(() => () => {
    if (audioQuestionsUnsubscribe.current) {
      audioQuestionsUnsubscribe.current();
    }
  }, []);

  if (!lessonId || lessonId.length < 4) {
    return <div>Invalid Lesson Id</div>;
  }

  return (
    <div>
      {!autoPlay && (
      <button
        onClick={() => setAutoPlay(true)}
        type="button"
      >
        Enable auto play questions
      </button>
      )}
      {autoPlay && (
      <button
        onClick={() => setAutoPlay(false)}
        type="button"
      >
        Disable auto play questions
      </button>
      )}

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Audio Questions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.container}>
            {audioQuestions && Object.keys(audioQuestions).sort((a, b) => (a < b ? 1 : -1)).map((key) => (
              <div
                key={key}
                className={classes.message}
              >
                <div>
                  {audioQuestions[key].studentName}
                  :
                  {new Date(Number(key)).toLocaleTimeString()}
                </div>
                <audio
                  controls
                  autoPlay={autoPlay && readyToListenQuestions && !playedQuestions.current[key]}
                  onPlay={() => addtoPlayedList(key, audioQuestions[key])}
                >
                  <source
                    src={audioQuestions[key].questionURL}
                    type="audio/ogg"
                  />
                  <track
                    default
                    kind="captions"
                    srcLang="en"
                  />
                  Your browser does not support the audio tag.
                </audio>
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>

    </div>
  );
};
