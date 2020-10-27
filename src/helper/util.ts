export class Util {
    public static invokeLogin: any = null;
}

export const teacherPortion = (commission:number, amount: number) => Math.round((amount
        * ((100 - commission) / 100)));

export const round = (num: number) => Math.round(num * 10) / 10;

export const formattedTime = (x: Date) => {
  const mmm = x.getMonth() + 1;
  const month = mmm > 9 ? mmm : `0${mmm}`;
  const date = x.getDate() > 9 ? x.getDate() : `0${x.getDate()}`;

  const hh = x.getHours() > 9 ? x.getHours() : `0${x.getHours()}`;
  const mm = x.getMinutes() > 9 ? x.getMinutes() : `0${x.getMinutes()}`;

  return `${x.getFullYear()}-${month}-${date}T${hh}:${mm}`;
};
