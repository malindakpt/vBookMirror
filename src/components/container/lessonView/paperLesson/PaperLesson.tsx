import { Button } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../../App';
import Config from '../../../../data/Config';
import { Entity, getDocsWithProps, getDocWithId } from '../../../../data/Store';
import { promptPayment, Util } from '../../../../helper/util';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { IPaperLesson } from '../../../../interfaces/ILesson';
import { IPayment, PaymentType } from '../../../../interfaces/IPayment';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { PDFView } from '../../../presentational/pdfView/PDFView';
import { Player } from '../../../presentational/player/Player';
import { MCQAnswer, Status } from '../../addLesson/addMCQ/mcqAnswer/MCQAnswer';
import classes from './PaperLesson.module.scss';

export const PaperLesson = () => {
  const { email, showSnackbar } = useContext(AppContext);
  // disble context menu for avoid right click
  document.addEventListener('contextmenu', (event) => event.preventDefault());
  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [paper, setPaper] = useState<IPaperLesson>();
  const [freeOrPurchased, setFreeOrPurchased] = useState<boolean>();
  const [answers, setAnswers] = useState<string[]>([]);
  const [validated, setValidate] = useState<boolean>(false);

  const processPaper = async () => {
    getDocWithId<IPaperLesson>(Entity.PAPER_LESSON, lessonId).then((paper) => {
      if (!paper) return;

      // Fetch techer for show teache info and check is this running lesson ID
      getDocWithId<ITeacher>(Entity.TEACHERS, paper.ownerEmail).then((teacher) => {
        teacher && setTeacher(teacher);

        if (paper.price) {
          if (email) {
            getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS,
              { lessonId, ownerEmail: email }).then((data) => {
              // TODO:  Check refundable lessons here
              if (data && data.length > 0) {
                setPaper(paper);
                setFreeOrPurchased(true);
              } else {
                teacher && promptPayment(email, teacher, paper, PaymentType.MCQ_PAPER,
                  () => {
                    setTimeout(() => {
                      window.location.reload();
                    }, Config.realoadTimeoutAferSuccessPay);
                  }, showSnackbar);
              }
            });
          } else {
            showSnackbar('Please login with your Gmail address');
            Util.invokeLogin();
          }
        } else {
          setPaper(paper);
          setFreeOrPurchased(true);
        }
      });
    });
  };

  useEffect(() => {
    setAnswers((prev) => {
      const clone = [];
      if (paper?.answers) {
        for (const a of paper?.answers) {
          clone.push('0');
        }
      }
      return clone;
    });
  }, [paper]);

  useEffect(() => {
    processPaper();
  }, []);

  const getStatus = (paper: IPaperLesson, idx: number) => {
    if (validated) {
      if (paper.answers[idx].ans === answers[idx]) {
        return Status.Correct;
      }
      return Status.Wrong;
    }
    return Status.Unknown;
  };

  return (
    <div>
      {paper ? (
        <div>
          <div>{paper.topic}</div>
          <div>{paper.description}</div>
          <PDFView url={paper.pdfURL} />

          <div className={classes.questions}>
            {
              answers?.map((ans, idx) => (
                <div
                  className={classes.question}
                  key={idx}
                >
                  <MCQAnswer
                    idx={idx}
                    ans={ans}
                    status={getStatus(paper, idx)}
                    possibleAnswers={paper.possibleAnswers}
                    onSelectAnswer={(idx, ans) => {
                      setAnswers((prev) => {
                        const clone = [...prev];
                        clone[idx] = ans;
                        return clone;
                      });
                    }}
                  />
                </div>
              ))
            }
          </div>
          <div className={classes.validate}>
            <Button
              variant="contained"
              color="default"
              onClick={() => setValidate(true)}
            >
              Validate Answers
            </Button>
          </div>
          <div>
            {paper.videoUrl && (
            <div>
              { showVideo ? (
                <Player videoUrl={paper.videoUrl} />
              )
                : (
                  <Button
                    variant="contained"
                    color="default"
                    onClick={() => setShowVideo(true)}
                  >
                    Show Discussion Video
                  </Button>
                )}
            </div>
            )}
          </div>
        </div>
      ) : <div>Not Loaded</div>}
    </div>
  );
};
