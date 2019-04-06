import * as React from "react";
import { fireEvent, render } from "react-testing-library";

import { useEventListener } from ".";

type EventListener = (event: Event) => void;

type RenderComponent = (
  eventListener: EventListener
) => ReturnType<typeof render>;

interface TestComponentProps {
  eventListener: EventListener;
}

describe("useEventListener", () => {
  let renderComponent: RenderComponent;
  let testId: string;

  beforeAll(() => {
    testId = "element-with-listener";

    const TestComponent: React.SFC<TestComponentProps> = ({
      eventListener
    }) => {
      const setRef = useEventListener("click", eventListener);

      return (
        <div data-testid={testId} ref={setRef}>
          Hello
        </div>
      );
    };

    renderComponent = eventListener =>
      render(<TestComponent eventListener={eventListener} />);
  });

  it("works properly", () => {
    const eventListener = jest.fn();

    const { getByTestId } = renderComponent(eventListener);

    fireEvent.click(getByTestId(testId) as Element | Window);

    expect(eventListener).toHaveBeenCalledTimes(1);
  });
});
