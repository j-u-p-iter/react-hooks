let onObserve: any = null;
const observingElements = new Set();

const IntersectionObserverMock = (callback: IntersectionObserverCallback) => {
  onObserve = callback;

  return {
    observe: (element: Element) => {
      observingElements.add(element);
    },
    unobserve: (element: Element) => {
      observingElements.delete(element);
    },
    disconnect: () => {
      observingElements.clear();
      onObserve = null;
    }
  };
};

export const addMock = () => {
  // @ts-ignore
  global.IntersectionObserver = IntersectionObserverMock;
};

export const removeMock = () => {
  // @ts-ignore
  global.IntersectionObserver = null;
};

export const mockIsIntersecting = (
  elements: NodeListOf<HTMLElement>,
  isIntersecting: boolean
) => {
  if (!onObserve) {
    throw new Error("You should initialize IntersectionObserver at first!");
  }

  const entries = Array.from(elements).map(element => {
    const observingElement = observingElements.has(element);

    if (!observingElement) {
      throw new Error(
        "This element is absent from observing elements! You should start observing it at first."
      );
    }

    const entry = {
      isIntersecting,
      target: element
    };

    return entry;
  });

  onObserve(entries);
};
