import { useEffect, useRef, useState } from "react";

type UseIOHook = () => any;
export const useIO: UseIOHook = () => {
  const [elements, setElements] = useState<NodeListOf<HTMLElement> | []>([]);
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);

  const io = useRef<any>(null);

  useEffect(() => {
    if (elements.length) {
      io.current = new IntersectionObserver(ioEntries => {
        setEntries(ioEntries);
      });

      elements.forEach((element: HTMLElement) => {
        io.current.observe(element);
      });
    }

    return () => {
      if (io.current) {
        io.current.disconnect();
      }
    };
  }, [elements]);

  return {
    io: io.current,
    setElements,
    entries
  };
};
