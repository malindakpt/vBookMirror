export interface IExam {
    id: string;
    name: string;
    type: string; // special batches/ theory or revison
    subjectIds: string[];
    ownerEmail: string;
    createdAt: number;
}
