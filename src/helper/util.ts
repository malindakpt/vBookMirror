import { ILesson } from '../interfaces/ILesson';

export class Util {
    public static invokeLogin: any = null;
}

export const calcTeacherCommission = (l: ILesson, commission: number): number => l.price * ((100
     - commission) / 100) * (l.subCount ?? 0);
