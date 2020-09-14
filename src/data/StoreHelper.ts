export const filterId = <T>(subjects: ({id: string} & T)[], subjectId: string): T|null => {
  const filtered = subjects.filter((subject) => subject.id === subjectId);
  return filtered.length > 0 ? filtered[0] : null;
};
