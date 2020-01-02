import { fireEvent, render } from "@testing-library/react";
import * as React from "react";

import { useEventListener } from ".";

type EventListener = (event: Event) => void;

type RenderComponent = (
  eventListener: EventListener,
  elementWithEventListener: "first" | "second"
) => ReturnType<typeof render>;

interface TestComponentProps {
  eventListener: EventListener;
  elementWithEventListener: "first" | "second";
}

const { useState } = React;
const noop = () => {};

describe("useEventListener", () => {
  enum ElementTitle {
    FIRST = "first",
    SECOND = "second"
  }

  let renderComponent: RenderComponent;

  let firstElementTestId: string;
  let secondElementTestId: string;

  let firstButtonTestId: string;
  let secondButtonTestId: string;

  beforeAll(() => {
    firstElementTestId = "first-element-test-id";
    secondElementTestId = "second-element-test-id";

    firstButtonTestId = "first-button-test-id";
    secondButtonTestId = "second-button-test-id";

    const TestComponent: React.SFC<TestComponentProps> = ({
      eventListener,
      elementWithEventListener: elementWithEventListenerFromProps
    }) => {
      const [elementWithEventListener, setElementWithEventListener] = useState(
        elementWithEventListenerFromProps
      );
      const setRef = useEventListener("click", eventListener);

      const refs = {
        firstElementRef:
          elementWithEventListener === ElementTitle.FIRST ? setRef : noop,
        secondElementRef:
          elementWithEventListener === ElementTitle.SECOND ? setRef : noop
      };

      return (
        <>
          <button
            data-testid={firstButtonTestId}
            onClick={() => setElementWithEventListener(ElementTitle.FIRST)}
          >
            Bind listener to the first element
          </button>
          <button
            data-testid={secondButtonTestId}
            onClick={() => setElementWithEventListener(ElementTitle.SECOND)}
          >
            Bind listener to the second element
          </button>

          <div data-testid={firstElementTestId} ref={refs.firstElementRef}>
            First element
          </div>
          <div data-testid={secondElementTestId} ref={refs.secondElementRef}>
            Second element
          </div>
        </>
      );
    };

    renderComponent = (eventListener, elementWithEventListener) =>
      render(
        <TestComponent
          eventListener={eventListener}
          elementWithEventListener={elementWithEventListener}
        />
      );
  });

  it("works properly", () => {
    const eventListener = jest.fn();

    const { getByTestId } = renderComponent(eventListener, ElementTitle.FIRST);
    const firstElement = getByTestId(firstElementTestId);
    const secondElement = getByTestId(secondElementTestId);

    const firstButton = getByTestId(firstButtonTestId);
    const secondButton = getByTestId(secondButtonTestId);

    fireEvent.click(firstElement as Element);

    expect(eventListener).toHaveBeenCalledTimes(1);

    fireEvent.click(secondButton as Element);
    fireEvent.click(secondElement as Element);

    expect(eventListener).toHaveBeenCalledTimes(2);

    fireEvent.click(firstButton as Element);
    fireEvent.click(firstElement as Element);

    expect(eventListener).toHaveBeenCalledTimes(3);
  });
});
