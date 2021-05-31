import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import classes from './AudioMessages.module.scss';
import { Entity, listenFileChanges } from '../../../data/Store';
import { IAudioQuestion } from '../../../interfaces/IAudioQuestion';
import { ILiveLesson } from '../../../interfaces/ILesson';
import askImage from '../../../images/ask.png';

export interface Props {
    lessonId: string
 }

export const AudioMessages: React.FC<Props> = ({ lessonId }) => {
  const audioQuestionsSubscription = useRef<any>();
  const [readyToListenQuestions, setReadyTOListenQuestions] = useState<boolean>(false);
  //   const playedQuestions = useRef<Record<string, boolean>>({});
  const [audioQuestions, setAudioQuestions] = useState<Record<string, IAudioQuestion>>();
  const playedQuestions = useRef<Record<string, IAudioQuestion>>({});
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  const startListenAudioQuestions = useCallback(() => {
    if (!audioQuestionsSubscription.current) {
      audioQuestionsSubscription.current = listenFileChanges<ILiveLesson>(Entity.LESSONS_LIVE, lessonId, (data) => {
        console.log(data);
        if (data && data.audioQuestions) {
          setAudioQuestions(data.audioQuestions);
          if (!readyToListenQuestions) {
            playedQuestions.current = (data.audioQuestions);
          }
        }

        setTimeout(() => {
          setReadyTOListenQuestions(true);
        }, 3000);
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

    return () => {
      if (audioQuestionsSubscription.current) {
        audioQuestionsSubscription.current.unsubscribe();
      }
    };
  }, [startListenAudioQuestions]);

  if (!lessonId || lessonId.length < 4) {
    return <div>Invalid Lesson Id</div>;
  }

  return (
    <div>
      {readyToListenQuestions && <div>Listening Stared</div>}
      {/* {!audioQuestionsSubscription.current && (
      <button
        onClick={startListenAudioQuestions}
        type="button"
      >
        Listen Audio Questions
      </button>
      )} */}

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

      <div className={classes.container}>
        {audioQuestions && Object.keys(audioQuestions).sort((a, b) => (a < b ? 1 : -1)).map((key) => (
          <div
            key={key}
            className={classes.message}
          >
            <div>{audioQuestions[key].studentName}</div>
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
    </div>
  );
};
