import { ILesson } from '../interfaces/ILesson';
import { paymentJS, startPay } from './payment';

export const promptPayment = (
  email: string,
  lesson: ILesson,
  onComplete: (lessonId: string) => void,
  showSnackbar: (msg: string) => void,
) => {
  // const dd = new Date().getTime();
  paymentJS.onDismissed = function onDismissed() {
    showSnackbar(
      // eslint-disable-next-line max-len
      'DEV: ඔබ මුදල් ගෙවීම සාර්ථකද නැද්ද යන්න බලාගැනීමට මිනිත්තු 2 කින් පමණ නැවත මෙම පිටුවට පිවිසෙන්න. Payment is processing. Please refresh the page after 2 minutes',
    );
  };

  paymentJS.onCompleted = function onCompleted() {
    console.log('Payment Succeed');
    showSnackbar(
      // eslint-disable-next-line max-len
      'ඔබ මුදල් ගෙවීම සාර්ථකද නැද්ද යන්න බලාගැනීමට මිනිත්තු 2 කින් පමණ නැවත මෙම පිටුවට පිවිසෙන්න. Payment is processing. Please refresh the page after 2 minutes',
    );
    onComplete(lesson.id);
  };

//   startPay(
//     email,
//     Util.fullName,
//     lesson,
//     payable(teacher.commissionVideo, lesson.price),
//     teacher.ownerEmail,
//     paymentType,
//   );
};
