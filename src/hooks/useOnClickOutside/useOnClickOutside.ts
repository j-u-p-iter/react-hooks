import { RefObject, useEffect } from "react";

const addEventListeners = (
  target: Window | Element,
  eventNames: string[],
  handler: EventListener
) => {
  eventNames.forEach(eventName => {
    target.addEventListener(eventName, handler);
  });
};

const removeEventListeners = (
  target: Window | Element,
  eventNames: string[],
  handler: EventListener
) => {
  eventNames.forEach(eventName => {
    target.removeEventListener(eventName, handler);
  });
};

export const useOnClickOutside = (
  ref: RefObject<any>,
  onClick: EventListener
) => {
  useEffect(() => {
    const handler = (event: Event) => {
      if (!ref || ref.current.contains(event.target)) {
        return;
      }

      onClick(event);
    };

    addEventListeners(window, ["mousedown", "touchstart"], handler);

    return () =>
      removeEventListeners(window, ["mousedown", "touchstart"], handler);
  }, [ref, onClick]);
};
