export const getObject = <T>(arr: ({id: string} & T)[], id: string): T|null => {
  const filtered = arr.filter((subject) => subject.id === id);
  return filtered.length > 0 ? filtered[0] : null;
};
