import { useEffect, useRef, useState } from "react";

type EventListener = (event: Event) => void;

export const useEventListener = (
  eventName: string,
  eventListener: EventListener
): ((element: any) => void) => {
  const [element, setElement] = useState(null);

  const setRef = (node: any): void => {
    setElement(node);
  };

  const eventListenerStore: ReturnType<typeof useRef> = useRef();

  useEffect(() => {
    eventListenerStore.current = eventListener;
  }, [eventListener]);

  useEffect(() => {
    if (!element) {
      return;
    }

    (element! as Element).addEventListener(
      eventName,
      eventListenerStore.current as EventListener
    );

    return () => {
      (element! as Element).removeEventListener(
        eventName,
        eventListenerStore.current as EventListener
      );
    };
  }, [eventName, element]);

  return setRef;
};
