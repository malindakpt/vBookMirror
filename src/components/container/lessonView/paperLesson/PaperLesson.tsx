import { Button } from '@material-ui/core';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { AppContext } from '../../../../App';
import Config from '../../../../data/Config';
import {
  Entity, getDocsWithProps, getDocWithId, updateDoc,
} from '../../../../data/Store';
import { promptPayment, Util } from '../../../../helper/util';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { ILesson, IPaperLesson } from '../../../../interfaces/ILesson';
import { IPayment, PaymentType } from '../../../../interfaces/IPayment';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { PDFView } from '../../../presentational/pdfView/PDFView';
import { Player } from '../../../presentational/player/Player';
import { AlertDialog, AlertMode } from '../../../presentational/snackbar/AlertDialog';
import { MCQAnswer, Status } from '../../addLesson/addMCQ/mcqAnswer/MCQAnswer';
import classes from './PaperLesson.module.scss';

export const PaperLesson = () => {
  const history = useHistory();
  const { email, showSnackbar } = useContext(AppContext);
  const timerRef = useRef<any>();

  // disble context menu for avoid right click
  document.addEventListener('contextmenu', (event) => event.preventDefault());
  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [paper, setPaper] = useState<IPaperLesson>();
  // const [freeOrPurchased, setFreeOrPurchased] = useState<boolean>();
  const [answers, setAnswers] = useState<string[]>([]);
  const [validated, setValidate] = useState<boolean>(false);

  const [warn, setWarn] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);
  const [payment, setPayment] = useState<IPayment>();
  const [tempLesson, setTempLesson] = useState<IPaperLesson>();

  const amIOwnerOfLesson = (lesson: ILesson) => email === lesson.ownerEmail;

  const startPaperRendering = (lesson: IPaperLesson) => {
    setPaper(lesson);
  };

  const startExpireLessonForUser = () => {
    const pay = payment;
    // If owner is watching the video no need to update
    if (pay) {
      timerRef.current = setTimeout(() => {
        const watchedCount = pay?.watchedCount ?? 0;
        const changes = {
          watchedCount: watchedCount + 1,
          disabled: watchedCount + 1 === Config.allowedWatchCount,
        };
        updateDoc(Entity.PAYMENTS_STUDENTS, pay.id, { ...pay, ...changes }).then(() => {
          const remain = Config.allowedWatchCount - changes.watchedCount;
          const msg = remain < 1 ? 'This is the last watch time for your payment.'
            : `You can watch this lesson ${remain} more times in the future`;
          setWarn(msg);
        });
      }, Config.watchedTimeout);
    }
  };

  const onAcceptAlert = () => {
    if (email && tempLesson && teacher) {
      startPaperRendering(tempLesson);
      setWarn('Do not reload this page');
      startExpireLessonForUser();
    } else {
      showSnackbar('Please login with your gmail address');
    }
  };

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
              const validPayment = data.find((pay) => (!pay.disabled && (pay.watchedCount || 0)
                < Config.allowedWatchCount));

              if (validPayment) {
                setAlert(true);
                setPayment(validPayment);
                setTempLesson(paper);
              } else if (amIOwnerOfLesson(paper)) {
                setWarn('Watch as owner');
                startPaperRendering(paper);
              } else {
                setWarn('මුදල් ගෙවියයුතු ප්‍රශ්න පත්‍රයකි .  ඔබ දැනටමත්  මුදල් ගෙවා ඇත්නම්  මිනිත්තු 2 කින් පමණ නැවත උත්සහ කරන්න.\n This is a paid exam paper. Please try again in 2 miniutes if you have paid already');
                teacher && promptPayment(email, teacher, paper, PaymentType.VIDEO_LESSON, () => {
                // DO not reload this page since it can cause to reset your watch count
                }, showSnackbar);
              }
              // TODO:  Check refundable lessons here
              // if (data && data.length > 0) {
              //   setPaper(paper);
              //   // setFreeOrPurchased(true);
              // } else {
              //   teacher && promptPayment(email, teacher, paper, PaymentType.PAPER_LESSON,
              //     () => {
              //       setTimeout(() => {
              //         window.location.reload();
              //       }, Config.realoadTimeoutAferSuccessPay);
              //     }, showSnackbar);
              // }
            });
          } else {
            // showSnackbar('Please login with your Gmail address');
            Util.invokeLogin();
          }
        } else {
          setPaper(paper);
          // setFreeOrPurchased(true);
        }
      });
    });
  };

  useEffect(() => {
    setAnswers((prev) => {
      const clone = [];
      if (paper?.answers) {
        for (let i = 0; i < paper.answers.length; i += 1) {
          clone.push('0');
        }
      }
      return clone;
    });
  }, [paper]);

  useEffect(() => {
    processPaper();

    return () => {
      clearInterval(timerRef.current);
    };
    // eslint-disable-next-line
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
          <div className={classes.warn}>
            {warn}
          </div>
          <h2>{paper.topic}</h2>
          <div>{paper.description}</div>

          <PDFView url={paper.pdfURL} />

          {teacher && (
          <div>
            {/* <a
              href={`tel:${teacher.phoneChat}`}
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Call Teacher:
              {teacher.phoneChat}
            </a> */}
          </div>
          )}
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
          {paper.answers.length > 0 && !validated && (
            <div className={classes.validate}>
              <Button
                variant="contained"
                color="default"
                onClick={() => setValidate(true)}
              >
                Validate Answers
              </Button>
            </div>
          )}
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
      ) : <div>Paper Not Loaded</div>}
      {alert && payment && (
      <AlertDialog
        type={AlertMode.VIDEO}
        onAccept={() => {
          setAlert(false);
          onAcceptAlert();
        }}

        onCancel={() => {
          setAlert(false);
          history.goBack();
        }}
      />
      )}
    </div>
  );
};
