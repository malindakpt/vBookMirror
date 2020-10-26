export class Util {
    public static invokeLogin: any = null;
}

export const teacherPortion = (commission:number, amount: number) => Math.round((amount
        * ((100 - commission) / 100)));

export const round = (num: number) => Math.round(num * 10) / 10;
