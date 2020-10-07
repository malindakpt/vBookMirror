export interface IExam {
    id: string;
    name: string;
    // year: string; // Focused year of exam
    type: string; // special batches/ theory or revison
    subjectIds: string[];
    // years: string[]
    ownerEmail: string;
}
