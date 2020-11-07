export enum LocalStorageKeys {
  STUDENT_INFO = 'STUDENT_INFO',
}

export const addToStorage = (key: LocalStorageKeys, obj: Object): void => {
  localStorage.setItem(key, JSON.stringify(obj));
};

export const getFromStorage = (key: LocalStorageKeys): object | null => {
  const str = localStorage.getItem(key);
  if (str) {
    return JSON.parse(str);
  }
  return null;
};
