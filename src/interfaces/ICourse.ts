export interface ICourse {
    id: string;
    subjectId: string;
    examYear: string;
    examId: string; // TODO try to remve lessons from here
    videoLessonOrder: string[]; // By this, we can keep the order of lessons,if we decider by a ttr related to lesson then we have to update all the lessons when order is if we had courseIds as a attr of lesson this is impossible
    ownerEmail: string;
}
