import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classes from "./AudioMessages.module.scss";
import { Entity, listenFileChanges } from "../../../data/Store";
import { IAudioQuestion } from "../../../interfaces/IAudioQuestion";
import { ILiveLesson } from "../../../interfaces/ILesson";
import askImage from "../../../images/ask.png";

export interface Props {
  lessonId: string;
}

export const AudioMessages: React.FC<Props> = ({ lessonId }) => {
  const audioQuestionsUnsubscribe = useRef<any>();
  const [readyToListenQuestions, setReadyToListenQuestions] =
    useState<boolean>(true);

  const [audioQuestions, setAudioQuestions] = useState<
    Record<string, IAudioQuestion> | undefined
  >(undefined);
  const [processedQuestions, setProcessedQuestions] = useState<
    Record<string, IAudioQuestion> | undefined
  >(undefined);
  const [allowAutoPlay, setAllowAutoPlay] = useState<boolean>(false);

  useEffect(() => {
    const newQuestions: Record<string, IAudioQuestion> = {};

    if (audioQuestions) {
      Object.entries(audioQuestions).forEach(([key, question]) => {
        if (processedQuestions && !processedQuestions[key]) {
          newQuestions[key] = question;
        }
      });


      console.log(newQuestions);

      const keys = Object.keys(newQuestions);
      if (keys.length > 0 && processedQuestions) {
        // If this is not the first data fetch
        const question = newQuestions[keys[0]];
        const audio = new Audio(question.questionURL);

        audio.onended = () => {
          setReadyToListenQuestions(true);
        };

        if (allowAutoPlay) {
          if (readyToListenQuestions) {
            console.log('Playing...');
            audio.play();
          }
        } else {
          // eslint-disable-next-line no-new
          new Notification("New Question", {
            body: question.studentName,
            icon: askImage,
          });
        }
      }
      setProcessedQuestions(audioQuestions);
    }
  }, [audioQuestions]);

  const startListenAudioQuestions = useCallback(() => {
    if (!audioQuestionsUnsubscribe.current) {
      console.log("Subscribed to questions");
      audioQuestionsUnsubscribe.current = listenFileChanges<ILiveLesson>(
        Entity.LESSONS_LIVE,
        lessonId,
        (data) => {
          if (data && data.audioQuestions) {
            setAudioQuestions(data.audioQuestions);
          }
        }
      );
    }
  }, [lessonId, readyToListenQuestions]);

  useEffect(() => {
    startListenAudioQuestions();
  }, [startListenAudioQuestions]);

  // cleanup function
  useEffect(
    () => () => {
      if (audioQuestionsUnsubscribe.current) {
        audioQuestionsUnsubscribe.current();
      }
    },
    []
  );

  if (!lessonId || lessonId.length < 4) {
    return <div>Invalid Lesson Id</div>;
  }

  return (
    <div>
      <div>
        {!allowAutoPlay && (
          <button onClick={() => setAllowAutoPlay(true)}
            type="button">
            Enable auto play questions
          </button>
        )}
        {allowAutoPlay && (
          <button onClick={() => setAllowAutoPlay(false)}
            type="button">
            Disable auto play questions
          </button>
        )}
      </div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Audio Questions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <div className={classes.container}>
              {audioQuestions &&
                Object.keys(audioQuestions)
                  .sort((a, b) => (a < b ? 1 : -1))
                  .map((key) => (
                    <div
                      key={key}
                      className={classes.message}>
                      <div>
                        {audioQuestions[key].studentName}:
                        {new Date(Number(key)).toLocaleTimeString()}
                      </div>
                      <audio
                        controls
                      >
                        <source
                          src={audioQuestions[key].questionURL}
                          type="audio/ogg"
                        />
                        <track
                          default
                          kind="captions"
                          srcLang="en" />
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  ))}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
