/* eslint-disable max-len */
// import * as firebase from 'firebase/app';
import Config from '../data/Config';
import {
  addDoc, Entity, getDocsWithProps, updateDoc,
} from '../data/Store';
import { ILesson, ILiveLesson, LessonType } from '../interfaces/ILesson';
import { IPayment, PaymentType } from '../interfaces/IPayment';
import { ITeacher } from '../interfaces/ITeacher';
import { paymentJS, startPay } from './payment';

export const DEFAULT_FULL_NAME = 'Unknown';
export class Util {
    public static invokeLogin: any = null;

    public static fullName = DEFAULT_FULL_NAME;
}

export const readyToGo = (payments: IPayment[], lesson: ILesson): { ok: boolean, payment?: IPayment} => {
  let okPayment;
  if (lesson.type === LessonType.LIVE) {
    okPayment = payments?.filter((p) => !p.disabled).find(
      (pay) => pay.lessonId === lesson.id);
  } else {
    okPayment = payments?.filter((p) => !p.disabled).find(
      (pay) => (pay.lessonId === lesson.id) && ((pay.watchedCount ?? 0) < Config.allowedWatchCount));
  }
  if (lesson.price === 0) {
    return {
      ok: true,
    };
  }
  return {
    ok: !!okPayment,
    payment: okPayment,
  };
};

export const checkRefund = (email: string, lessonId: string,
  maxCount: number, onError: (msg: string) => void) => {
  getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, { lessonId }).then((allPaymentsForCourse) => {
    if (allPaymentsForCourse && (allPaymentsForCourse.length > maxCount)) {
      allPaymentsForCourse.sort((a, b) => a.date - b.date);
      const myIndex = allPaymentsForCourse.findIndex((ap) => ap.ownerEmail === email);

      if (myIndex >= maxCount) {
        const myPayment = allPaymentsForCourse[myIndex];
        onError('Maximum allowed students reached. Money will be refunded back soon');
        addDoc(Entity.REFUND_REQUESTS, myPayment);
        updateDoc(Entity.PAYMENTS_STUDENTS, myPayment.id, { disabled: true });
      }
    }
  });
};

export const isMobile = () => window.innerWidth < 599;

export const teacherPortion = (commission:number, amount: number) => Math.ceil((amount
        * ((100) / (100 + commission))));

export const payable = (commissionRate:number, amount: number) => Math.ceil((amount
          * ((100 + commissionRate) / 100)));

export const round = (num: number) => Math.round(num * 10) / 10;

export const isLiveLessonRunning = (l: ILiveLesson) => {
  const now = new Date().getTime();
  const finish = l.dateTime + l.duration * 60 * 60 * 1000;
  return now < finish;
};

export const formattedTime = (x: Date) => {
  const mmm = x.getMonth() + 1;
  const month = mmm > 9 ? mmm : `0${mmm}`;
  const date = x.getDate() > 9 ? x.getDate() : `0${x.getDate()}`;

  const hh = x.getHours() > 9 ? x.getHours() : `0${x.getHours()}`;
  const mm = x.getMinutes() > 9 ? x.getMinutes() : `0${x.getMinutes()}`;

  return `${x.getFullYear()}-${month}-${date}T${hh}:${mm}`;
};

export const getHashFromString = (s: string) => {
  if (!s) {
    return '';
  }
  let res = '';

  s.split('').forEach((c) => {
    const code = c.charCodeAt(0) + 103;
    res += code;
  });
  return res;
};

export const getStringFromHash = (s: string) => {
  if (!s) {
    return '';
  }
  let res = '';

  while (s.length > 0) {
    const code = Number(s.substr(0, 3)) - 103;
    res += String.fromCharCode(code);
    s = s.substr(3);
  }
  return res;
};

const showPaymentGuide = (show: boolean) => {
  const ele = document.getElementById('payGuide');
  if (ele) {
    ele.style.display = show ? 'block' : 'none';
  }
};

export const promptPayment = (email: string, teacher: ITeacher, lesson: ILesson,
  paymentType: PaymentType, onComplete: (lessonId: string) => void, showSnackbar: (msg: string) => void) => {
  // const dd = new Date().getTime();
  paymentJS.onDismissed = function onDismissed() {
    showPaymentGuide(false);
    if (Config.isProd) {
      console.log('Payment Dismissed');
      showSnackbar('ඔබ මුදල් ගෙවීම සාර්ථකද නැද්ද යන්න බලාගැනීමට මිනිත්තු 2 කින් පමණ නැවත මෙම පිටුවට පිවිසෙන්න. Payment is processing. Please refresh the page after 2 minutes');
      onComplete(lesson.id);
    } else {
      /// ////////////////////// This works only in Dev Mode////////////////////////
      if (!Config.payOnDismiss) {
        return;
      }
      console.log(`Succeed lessonId: ${lesson.id}`);
      /// /////////FAKE UPDATE START////////////
      addDoc(Entity.PAYMENTS_STUDENTS, {
        lessonId: lesson.id, ownerEmail: email, paidFor: lesson.ownerEmail, amount: lesson.price, ownerName: Util.fullName,
      });
      onComplete(lesson.id);
      /// ////////FAKE UPDATE END///////////////

      showSnackbar('DEV: ඔබ මුදල් ගෙවීම සාර්ථකද නැද්ද යන්න බලාගැනීමට මිනිත්තු 2 කින් පමණ නැවත මෙම පිටුවට පිවිසෙන්න. Payment is processing. Please refresh the page after 2 minutes');
    }
  };

  paymentJS.onCompleted = function onCompleted() {
    showPaymentGuide(false);
    console.log('Payment Succeed');
    showSnackbar('ඔබ මුදල් ගෙවීම සාර්ථකද නැද්ද යන්න බලාගැනීමට මිනිත්තු 2 කින් පමණ නැවත මෙම පිටුවට පිවිසෙන්න. Payment is processing. Please refresh the page after 2 minutes');
    onComplete(lesson.id);
  };

  if (paymentType === PaymentType.LIVE_LESSON) {
    getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, { lessonId: lesson.id }).then((data) => {
      if (data && data.length >= teacher.zoomMaxCount) {
        // TODO: send a notification to teacher
        showSnackbar('This live session is full. Please contact the teacher');
      } else {
        // setPayLesson(lesson);
        startPay(email, Util.fullName, lesson, payable(teacher.commissionLive,
          lesson.price), teacher.ownerEmail, PaymentType.LIVE_LESSON);
        showPaymentGuide(true);
      }
    });
  } else {
    startPay(email, Util.fullName, lesson, payable(teacher.commissionVideo,
      lesson.price), teacher.ownerEmail, paymentType);
    showPaymentGuide(true);
  }
};
