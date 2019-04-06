import { useEffect, useRef, useState } from "react";

type EventListener = (event: Event) => void;

export const useEventListener = (
  eventName: string,
  eventListener: EventListener
): ((element: Element | null) => void) => {
  const [element, setElement] = useState({
    addEventListener: () => {},
    removeEventListener: () => {}
  } as { addEventListener: any; removeEventListener: any });

  const setRef = (node: any): void => {
    setElement(node);
  };

  const eventListenerStore: ReturnType<typeof useRef> = useRef(() => {});

  useEffect(() => {
    eventListenerStore.current = eventListener;
  }, [eventListener]);

  useEffect(() => {
    element.addEventListener(
      eventName,
      eventListenerStore.current as EventListener
    );

    return () => {
      element.removeEventListener(
        eventName,
        eventListenerStore.current as EventListener
      );
    };
  }, [eventName, element]);

  return setRef;
};
