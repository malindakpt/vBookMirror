import { ILiveLesson } from '../interfaces/ILesson';

export class Util {
    public static invokeLogin: any = null;

    public static fullName = 'Unknown';
}

export const teacherPortion = (commission:number, amount: number) => Math.round((amount
        * ((100 - commission) / 100)));

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
  let res = '';
  s.split('').forEach((c) => {
    const code = c.charCodeAt(0) + 103;
    res += code;
  });
  return res;
};

export const getStringFromHash = (s: string) => {
  let res = '';
  while (s.length > 0) {
    const code = Number(s.substr(0, 3)) - 103;
    res += String.fromCharCode(code);
    s = s.substr(3);
  }
  return res;
};
