import { addDoc } from '../data/Store';
import { ILog } from '../interfaces/ILog';

export enum Page {
    EXAMS,
    SUBJECTS,
    COURSES,
    COURSE
}

export const send = (page: Page, error: boolean = false) => {
  const log: ILog = {
    page,
    screen: `${window.screen.availWidth}`,
    browser: navigator.userAgent,
    info: '',
    time: new Date().getTime(),
    error,
  };
  if (window.location.host === 'akshara.lk' && !localStorage.getItem('log_off')) {
    addDoc('log', log);
  } else {
    console.log(log);
  }
};
