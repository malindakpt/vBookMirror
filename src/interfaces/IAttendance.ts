import { IBase } from './IBase';

export interface IAttendance extends IBase {
    // id <= lessonId
    students: Record<string, IStudentAttendanceRecord>
}

export interface IStudentAttendanceRecord {
    id: string, ownerEmail: string, timestamp: number
}
