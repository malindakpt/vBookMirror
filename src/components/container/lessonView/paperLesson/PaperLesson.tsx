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
import { readyToGo, Util } from '../../../../helper/util';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { ILesson, IPaperLesson } from '../../../../interfaces/ILesson';
import { IPayment } from '../../../../interfaces/IPayment';
import { InteractionType } from '../../../../interfaces/IStudentUpdate';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { Banner } from '../../../presentational/banner/Banner';
import { PaymentManger } from '../../../presentational/paymentManager/PaymentManager';
import { PDFView } from '../../../presentational/pdfView/PDFView';
import { AlertDialog, AlertMode } from '../../../presentational/snackbar/AlertDialog';
import { CollectInfo } from '../../../presentational/snackbar/CollectInfo';
import { VideoViewer } from '../../../presentational/videoViewer/VideoViewer';
import { MCQAnswer, Status } from '../../addLesson/addPaperLesson/mcqAnswer/MCQAnswer';
import classes from './PaperLesson.module.scss';

export const PaperLesson = () => {
  const history = useHistory();
  const { email, showSnackbar, showPaymentPopup } = useContext(AppContext);
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
    getDocWithId<IPaperLesson>(Entity.LESSONS_PAPER, lessonId).then((paper) => {
      if (!paper) return;

      // Fetch techer for show teache info and check is this running lesson ID
      getDocWithId<ITeacher>(Entity.TEACHERS, paper.ownerEmail).then((teacher) => {
        teacher && setTeacher(teacher);

        if (paper.price) {
          if (email) {
            getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS,
              { lessonId, ownerEmail: email }).then((data) => {
              const status = readyToGo(data, paper);

              if (status.payment) {
                setAlert(true);
                setPayment(status.payment);
                setTempLesson(paper);
              } else if (amIOwnerOfLesson(paper)) {
                setWarn('Watch as owner');
                startPaperRendering(paper);
              } else {
                // eslint-disable-next-line max-len
                setWarn('මුදල් ගෙවියයුතු ප්‍රශ්න පත්‍රයකි .  ඔබ දැනටමත්  මුදල් ගෙවා ඇත්නම්  මිනිත්තු 2 කින් පමණ නැවත උත්සහ කරන්න.\n This is a paid exam paper. Please try again in 2 miniutes if you have paid already');
                if (teacher) {
                  showPaymentPopup({
                    email,
                    paidFor: teacher.ownerEmail,
                    lesson: paper,
                    teacher,
                    onSuccess: () => {},
                    onCancel: () => {},
                  });
                }
                // teacher && promptPayment(email, teacher, paper, PaymentType.VIDEO_LESSON, () => {
                // // DO not reload this page since it can cause to reset your watch count
                // }, showSnackbar);
              }
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
    const ans = [];
    if (paper?.answers) {
      for (let i = 0; i < paper.answers.length; i += 1) {
        ans.push('0');
      }
    }
    setAnswers(ans);
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

  const correctCount = () => {
    let okCount = 0;
    paper?.answers.forEach((ans, idx: number) => {
      if (ans.ans === answers[idx]) {
        okCount += 1;
      }
    });
    return okCount;
  };

  return (
    <div>
      <PaymentManger lesson={paper} />
      {paper && (
        <>
          <CollectInfo
            reference={paper.id}
            lessonType={InteractionType.MCQ_PAPER}
          />
        </>
      )}
      { teacher && (
      <Banner teacher={teacher} />
      )}
      {paper ? (
        <div>
          <div className={classes.warn}>
            {warn}
          </div>
          <h2>{paper.topic}</h2>
          <div>{paper.description}</div>
          <div>
            <a
              href={`tel:${teacher?.phoneChat}`}
            >
              Contact Teacher:
              {teacher?.phoneChat}
            </a>
          </div>

          <PDFView url={paper.pdfURL} />

          <br />
          <div>පහතින් පිළිතුරු ලකුණු කරන්න. Mark the answers here.</div>
          <div className={classes.questions}>
            {
              answers?.map((ans, idx: number) => (
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
          {validated && (
          <h3 style={{ color: 'red', textAlign: 'center' }}>
            Wow!!
            {' '}
            {' '}
            {correctCount()}
            {' '}
            out of
            {' '}
            {answers.length}
            {' '}
            are correct.
          </h3>
          )}
          {paper.answers.length > 0 && !validated && (
            <div className={classes.validate}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setValidate(true)}
              >
                Complete
              </Button>
            </div>
          )}
          <div>
            {paper.videoUrl && (
            <div>
              { showVideo ? (
                <VideoViewer lesson={paper} />
              )
                : (
                  <Button
                    variant="contained"
                    color="default"
                    onClick={() => setShowVideo(true)}
                  >
                    ප්‍රශ්ණ සාකච්චාව නරඹන්න/Show Discussion Video
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
