import { useEffect, useState } from "react";

export const useDebounce = function<P>(valueToDebounce: P, delay: number): P {
  const [newValue, setNewValue] = useState(valueToDebounce);

  useEffect(() => {
    const timeout = setTimeout(() => setNewValue(valueToDebounce), delay);

    return () => clearTimeout(timeout);
  }, [valueToDebounce, delay]);

  return newValue;
};
