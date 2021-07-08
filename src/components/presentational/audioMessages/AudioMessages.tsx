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
import { IQuestion } from "../../../interfaces/IQuestion";
import { ILiveLesson } from "../../../interfaces/ILesson";
import askImage from "../../../images/ask.png";

export interface Props {
  lessonId: string;
}

export const AudioMessages: React.FC<Props> = ({ lessonId }) => {
  const questionsUnsubscribe = useRef<any>();
  const [readyToListenQuestions, setReadyToListenQuestions] =
    useState<boolean>(true);

  const [questions, setQuestions] = useState<
    Record<string, IQuestion> | undefined
  >(undefined);
  const [processedQuestions, setProcessedQuestions] = useState<
    Record<string, IQuestion> | undefined
  >(undefined);
  const [allowAutoPlay, setAllowAutoPlay] = useState<boolean>(false);

  useEffect(() => {
    const newQuestions: Record<string, IQuestion> = {};

    if (questions) {
      Object.entries(questions).forEach(([key, question]) => {
        if (processedQuestions && !processedQuestions[key]) {
          newQuestions[key] = question;
        }
      });

      const keys = Object.keys(newQuestions);
      if (keys.length > 0 && processedQuestions) {
        // If this is not the first data fetch
        const question = newQuestions[keys[0]];

        if (question.audioURL) {
          const audio = new Audio(question.audioURL);
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

        if (question.questionText) {
          if (allowAutoPlay) {
            // eslint-disable-next-line no-new
            new Notification("New Question", {
              body: question.studentName,
              icon: askImage,
            });
          }
        }
      }
      setProcessedQuestions(questions);
    }
  }, [questions, allowAutoPlay, processedQuestions, readyToListenQuestions]);

  const startListenquestions = useCallback(() => {
    if (!questionsUnsubscribe.current) {
      console.log("Subscribed to questions");
      questionsUnsubscribe.current = listenFileChanges<ILiveLesson>(
        Entity.LESSONS_LIVE,
        lessonId,
        (data) => {
          if (data && data.questions) {
            setQuestions(data.questions);
          }
        }
      );
    }
  }, [lessonId]);

  useEffect(() => {
    startListenquestions();
  }, [startListenquestions]);

  // cleanup function
  useEffect(
    () => () => {
      if (questionsUnsubscribe.current) {
        questionsUnsubscribe.current();
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
          <Typography className={classes.heading}>Questions From Students</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <div className={classes.container}>
              {questions &&
                Object.keys(questions)
                  .sort((a, b) => (a < b ? 1 : -1))
                  .map((key) => (
                    <div
                      key={key}
                      className={classes.message}>
                      <div>
                        {questions[key].studentName}:
                        {new Date(Number(key)).toLocaleTimeString()}
                      </div>
                      {
                        questions[key].audioURL && <audio
                          controls
                        >
                          <source
                            src={questions[key].audioURL ?? ''}
                            type="audio/ogg"
                          />
                          <track
                            default
                            kind="captions"
                            srcLang="en" />
                          Your browser does not support the audio tag.
                        </audio>
                      }
                    </div>
                  ))}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
