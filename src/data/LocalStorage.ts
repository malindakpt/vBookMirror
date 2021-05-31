export enum LocalStorageKeys {
  STUDENT_INFO = 'STUDENT_INFO',
  INITIAL_LOGGED_TIME = 'INITIAL_LOGGED_TIME'
}

export const addToStorage = (key: LocalStorageKeys, obj: any): void => {
  localStorage.setItem(key, JSON.stringify(obj));
};

export const getFromStorage = (key: LocalStorageKeys): any | null => {
  const str = localStorage.getItem(key);
  if (str) {
    return JSON.parse(str);
  }
  return null;
};
