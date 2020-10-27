export interface ICourse {
    id: string;
    subjectId: string;
    examYear: string;
    examId: string; // TODO try to remve lessons from here
    lessons: string[]; // By this, we can keep the order of lessons, if we had courseIds as a attr of lesson this is impossible
    ownerEmail: string;
}
