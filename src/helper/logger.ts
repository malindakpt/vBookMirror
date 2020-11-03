import { addDoc, Entity } from '../data/Store';
import { ILog } from '../interfaces/ILog';

export enum Page {
    EXAMS = 'EXAMS',
    SUBJECTS= 'SUBJECTS',
    COURSES= 'COURSES',
    COURSE= 'COURSE',
    INTRO= 'INTRO',
}

export const sendLog = (page: Page, info: string, error: boolean = false) => {
  const log: ILog = {
    id: '',
    page,
    screen: `${window.screen.availWidth}`,
    browser: navigator.userAgent,
    info,
    time: new Date().getTime(),
    error,
    createdAt: new Date().getTime(),
  };
  if (window.location.host === 'akshara.lk' && !localStorage.getItem('log_off')) {
    addDoc(Entity.LOGS, log);
  } else {
    console.log(log);
  }
};
