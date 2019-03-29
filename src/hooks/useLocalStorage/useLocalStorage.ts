import { useState } from "react";

export const useLocalStorage = (key: any, initialValue: any) => {
  const [storedValue, setState] = useState(() => {
    const localStorageValue = localStorage.getItem(key);

    if (localStorageValue === null) {
      return initialValue;
    }

    const alreadyStoredValue = JSON.parse(localStorageValue);

    return alreadyStoredValue || initialValue;
  });

  const storeValue = (newValue: any) => {
    const currentStoredValue = storedValue;
    const valueToStore =
      newValue instanceof Function ? newValue(currentStoredValue) : newValue;

    setState(valueToStore);

    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, storeValue];
};
