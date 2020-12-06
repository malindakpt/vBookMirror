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
import { IPayment } from '../../../interfaces/IPayment';
import { teacherPortion } from '../../../helper/util';
import { IStudentUpdate } from '../../../interfaces/IStudentUpdate';
import { FileUploader } from '../../presentational/fileUploader/FileUploader';

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

  // const [banner1, setBanner1] = useState<string>('');
  // const [banner2, setBanner2] = useState<string>('');
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
            // if (vLes.price > 0) {
            const payList = payments.filter((p) => p.lessonId === vLes.id);
            vlessonArr.push({
              lesson: vLes,
              payments: payList,
            });
            // }
          }
        }

        if (lessonsL && payments) {
          for (const lLes of lessonsL) {
            // if (lLes.price > 0) {
            const payList = payments.filter((p) => p.lessonId === lLes.id);
            llessonArr.push({
              lesson: lLes,
              payments: payList,
            });
            // }
          }
        }

        if (lessonsP && payments) {
          for (const pLes of lessonsP) {
            // if (lLes.price > 0) {
            const payList = payments.filter((p) => p.lessonId === pLes.id);
            plessonArr.push({
              lesson: pLes,
              payments: payList,
            });
            // }
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
    getDocsWithProps<IStudentUpdate[]>(Entity.STUDENT_INFO, { reference: lesson.id }).then((data) => {
      if (data) {
        setViews({
          lessonId: lesson.id,
          count: data.length,
        });
      }
    });
  };

  const getLessonsTable = (lessons: LessMap[], teacher: ITeacher) => {
    let fullTotal = 0;

    return (
      <>
        <table className="center w100">
          <tbody>
            <tr key={0}>
              <th>Lesson</th>
              <th>Price</th>
              <th>Count</th>
              <th>Total</th>
            </tr>
            {

            lessons.map((val) => {
              const tot = val.payments.reduce(
                (a, b) => ({ ...a, amount: a.amount + b.amount }), { amount: 0 },
              ).amount;

              fullTotal += tot;

              return (
                <tr key={val.lesson.id}>
                  <td>{val.lesson.topic}</td>
                  <td>{val.lesson.price}</td>
                  <td>{val.payments.length}</td>
                  <td>
                    {teacherPortion(teacher.commissionVideo, tot)}
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
            <tr key={1}>
              <th>.</th>
              <th>.</th>
              <th>Total</th>
              <th style={{ color: 'blue', fontSize: '18px' }}>
                {teacherPortion(teacher.commissionVideo, fullTotal)}
              </th>
            </tr>
          </tbody>
        </table>
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
