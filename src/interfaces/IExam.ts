export interface IExam {
    id: string;
    name: string;
    batch: string; // Focused year of exam
    type: string; // special batches/ theory or revison
    subjectIds: string[];
}
