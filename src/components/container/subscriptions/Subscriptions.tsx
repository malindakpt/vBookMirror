import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  Button, FormControl, InputLabel, MenuItem, Select,
} from '@material-ui/core';
import classes from './Subscriptions.module.scss';
import { AppContext } from '../../../App';
import {
  Entity, FileType, getDocsWithProps, getDocWithId, updateDoc,
} from '../../../data/Store';
import { useBreadcrumb } from '../../../hooks/useBreadcrumb';
import { ILesson } from '../../../interfaces/ILesson';
import { ITeacher } from '../../../interfaces/ITeacher';
import { IPayment, PaymentGateway } from '../../../interfaces/IPayment';
import { teacherPortion } from '../../../helper/util';
import { IStudentInfo } from '../../../interfaces/IStudentInfo';
import { FileUploader } from '../../presentational/fileUploader/FileUploader';
import { PaymentStatus } from '../../presentational/paymentOptions/requestPayment/RequestPaymentValidation';

interface LessMap {payments: IPayment[], lesson: ILesson}

const months = ['January', 'February', 'March', 'April',
  'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December'];
const date = new Date();

export const Subscriptions = () => {
  useBreadcrumb();
  const { email, showSnackbar } = useContext(AppContext);

  const mobileBannerRef = useRef<any>();
  const desktopBannerRef = useRef<any>();

  const [videoLessons, setVideoLessons] = useState<LessMap[]>([]);
  const [liveLessons, setLiveLessons] = useState<LessMap[]>([]);
  const [paperLessons, setPaperLessons] = useState<LessMap[]>([]);

  const [teacher, setTeacher] = useState<ITeacher>();

  const [selectedMonth, setSelectedMonth] = useState<number>(date.getMonth());

  const getPeriodObj = (month: number) => {
    const fd = new Date(date.getFullYear(), month, 1).getTime();
    const ld = new Date(date.getFullYear(), month + 1, 0).getTime();

    return {
      'date>': fd,
      'date<': ld,
    };
  };

  useEffect(() => {
    if (email) {
      // TODO: add live lessons here
      Promise.all([
        getDocWithId<ITeacher>(Entity.TEACHERS, email),
        getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, {
          paidFor: email,
          ...getPeriodObj(selectedMonth),
        }),
        getDocsWithProps<ILesson[]>(Entity.LESSONS_VIDEO, { ownerEmail: email }),
        getDocsWithProps<ILesson[]>(Entity.LESSONS_LIVE, { ownerEmail: email }),
        getDocsWithProps<ILesson[]>(Entity.LESSONS_PAPER, { ownerEmail: email }),
      ]).then(([teacher, payments, lessonsV, lessonsL, lessonsP]) => {
        const vlessonArr: LessMap[] = [];
        const llessonArr: LessMap[] = [];
        const plessonArr: LessMap[] = [];

        if (lessonsV && payments) {
          for (const vLes of lessonsV) {
            const payList = payments.filter((p) => p.lessonId === vLes.id);
            vlessonArr.push({
              lesson: vLes,
              payments: payList,
            });
          }
        }

        if (lessonsL && payments) {
          for (const lLes of lessonsL) {
            const payList = payments.filter((p) => p.lessonId === lLes.id);
            llessonArr.push({
              lesson: lLes,
              payments: payList,
            });
          }
        }

        if (lessonsP && payments) {
          for (const pLes of lessonsP) {
            const payList = payments.filter((p) => p.lessonId === pLes.id);
            plessonArr.push({
              lesson: pLes,
              payments: payList,
            });
          }
        }

        if (teacher) {
          setTeacher(teacher);
          setVideoLessons(vlessonArr);
          setLiveLessons(llessonArr);
          setPaperLessons(plessonArr);
        }
      });
    }
  }, [email, selectedMonth]);

  const [views, setViews] = useState<{lessonId: string, count: number}>();

  const checkViews = (lesson: ILesson) => {
    getDocsWithProps<IStudentInfo[]>(Entity.STUDENT_INFO, { reference: lesson.id }).then((data) => {
      if (data) {
        setViews({
          lessonId: lesson.id,
          count: data.length,
        });
      }
    });
  };

  const getLessonsTable = (lessons: LessMap[], teacher: ITeacher) => {
    let gatewayTotal = 0;
    let manualPayTotal = 0;

    return (
      <>
        <div className={classes.table}>
          <table className="center w100">
            <tbody>
              <tr key={0}>
                <th>Date</th>
                <th>Lesson</th>
                <th>Price</th>
                <th>Akshara</th>

                <th>Other</th>

              </tr>
              {

            lessons.sort((a, b) => (b.lesson.createdAt?? 0) - (a.lesson.createdAt ?? 0)).map((val) => {
              let manualTot = 0;
              let gatewayTot = 0;

              let gatewayPayCountForLesson = 0;
              let manualPayCountForLesson = 0;

              val.payments.forEach((payment) => {
                if (payment.gateway === PaymentGateway.MANUAL) {
                  if (payment.status === PaymentStatus.VALIDATED) {
                    manualTot += payment.amount;
                    manualPayCountForLesson += 1;
                  }
                } else {
                  gatewayTot += (payment.amountPure ?? teacherPortion(teacher.commissionVideo,
                    payment.amount));
                  gatewayPayCountForLesson += 1;
                }
              });

              manualPayTotal += manualTot;
              gatewayTotal += gatewayTot;

              return (
                <tr key={val.lesson.id}>
                  <td>
                    <span>{val.lesson.createdAt && new Date(val.lesson.createdAt).toDateString()}</span>
                  </td>
                  <td>{val.lesson.topic}</td>
                  <td>{val.lesson.price}</td>
                  <td>
                    {gatewayTot}
                    {' '}
                    (
                    {gatewayPayCountForLesson}
                    )
                  </td>
                  <td>
                    { manualTot}
                    {' '}
                    (
                    {manualPayCountForLesson}
                    )
                  </td>
                  <td>
                    {views?.lessonId === val.lesson.id && <span><b>{views.count}</b></span>}
                    <Button
                      onClick={() => checkViews(val.lesson)}
                    >
                      Views
                    </Button>
                  </td>
                </tr>
              );
            })
            }
            </tbody>
          </table>
        </div>
        <div>
          Akshara.lk payments:
          {' '}
          <b>{gatewayTotal}</b>
          {'    ### '}
          Charges for other payments:
          {' '}
          <b>{(manualPayTotal * (teacher.commissionVideo - 5)) / 100}</b>
          <br />
          Balance:
          {' '}
          <b>{gatewayTotal - (manualPayTotal * (teacher.commissionVideo - 5)) / 100}</b>
        </div>
      </>
    );
  };

  const handleUploadSuccess = (changesObj: Object) => {
    if (teacher) {
      updateDoc(Entity.TEACHERS, teacher.id, changesObj)
        .then(() => showSnackbar('Banner image updated'));
    }
  };

  const getDisplayMonths = () => {
    const date = new Date();

    const monthArr = [];
    const month = date.getMonth();

    for (let m = 0; m < 4; m += 1) {
      const next = (month - m) < 0 ? 12 - m : (month - m);
      monthArr.push([next, months[next]]);
    }
    return monthArr;
  };

  return (
    <>
      {teacher ? (
        <div className={classes.container}>
          <div>
            <span style={{ marginRight: '5px' }}>Profile url:</span>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={`teacher/${teacher.url}`}
            >
              akshara.lk/teacher/
              {teacher.url}
            </a>
          </div>

          <FormControl className={classes.input}>
            <InputLabel
              id="demo-simple-select-label"
              className="fc1"
            >
              Select Month
            </InputLabel>
            <Select
              className={`${classes.input}`}
              labelId="label1"
              id="id1"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value as number)}
            >
              {getDisplayMonths().map((month) => (
                <MenuItem
                  value={month[0]}
                  key={month[0]}
                >
                  {month[1]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <h3>Video lessons income</h3>
          {
            getLessonsTable(videoLessons, teacher)
          }
          <h3>Paper lessons income</h3>
          {
            getLessonsTable(paperLessons, teacher)
          }
          <h3>Live lessons income</h3>
          {
            getLessonsTable(liveLessons, teacher)
          }
          <br />
          {' '}
          <br />
          {' '}
          <br />
          <div className={classes.banners}>
            <div>
              <FileUploader
                ref={mobileBannerRef}
                fileType={FileType.IMAGE}
                fileName="Mobile Cover Photo(2×1)"
                onSuccess={(f) => handleUploadSuccess({ bannerUrl1: f })}
              />

              <Button
                variant="contained"
                onClick={() => { mobileBannerRef.current?.startUploading(); }}
              >
                Save Mobile
              </Button>
            </div>
            <div>
              <FileUploader
                ref={desktopBannerRef}
                fileType={FileType.IMAGE}
                fileName="Desktop Cover Photo(4×1)"
                onSuccess={(f) => handleUploadSuccess({ bannerUrl2: f })}
              />
              <Button
                variant="contained"
                onClick={() => { desktopBannerRef.current?.startUploading(); }}
              >
                Save Desktop
              </Button>
            </div>
          </div>
        </div>
      )
        : <div />}
    </>
  );
};
