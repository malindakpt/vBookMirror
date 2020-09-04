import { useState } from 'react';

export const useForcedUpdate = () => {
  const [onUpdate, setCount] = useState(0);

  const updateUI = () => {
    setCount((prev) => prev + 1);
  };

  const state: [number, () => void] = [onUpdate, updateUI];
  return state;
};
