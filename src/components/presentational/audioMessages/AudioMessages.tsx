import React, { useEffect, useRef, useState } from 'react';
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

  useEffect(() => () => {
    if (audioQuestionsSubscription.current) {
      audioQuestionsSubscription.current.unsubscribe();
    }
  }, []);

  const startListenAudioQuestions = () => {
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
  };

  if (!lessonId || lessonId.length < 4) {
    return <div>Invalid Lesson Id</div>;
  }

  const addtoPlayedList = (key: string, audio: IAudioQuestion) => {
    playedQuestions.current[key] = audio;
    // eslint-disable-next-line no-new
    new Notification('Question', { body: audio.studentName, icon: askImage });
  };

  return (
    <div>
      {readyToListenQuestions && <div>Listening Stared</div>}
      <button
        onClick={startListenAudioQuestions}
        type="button"
      >
        Listen Audio Questions
      </button>

      <div className={classes.container}>
        {audioQuestions && Object.keys(audioQuestions).sort((a, b) => (a < b ? 1 : -1)).map((key) => (
          <div
            key={key}
            className={classes.message}
          >
            <div>{audioQuestions[key].studentName}</div>
            <audio
              controls
              autoPlay={readyToListenQuestions && !playedQuestions.current[key]}
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
