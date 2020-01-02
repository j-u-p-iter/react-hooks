import { useEffect } from "react";
import { useIO } from "../useIntersectionObserver";

type UseOnIntersectHook = (params: {
  elementSelector: string;
  onIntersect: (url: string) => void;
}) => { io: IntersectionObserver };
export const useOnIntersect: UseOnIntersectHook = ({
  elementSelector,
  onIntersect
}) => {
  const { setElements, entries, io } = useIO();

  useEffect(() => {
    setElements(document.querySelectorAll(elementSelector));
  }, []);

  useEffect(() => {
    if (!entries.length) {
      return;
    }

    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) {
        return;
      }

      onIntersect(target);
    });
  }, [entries]);

  return { io };
};
