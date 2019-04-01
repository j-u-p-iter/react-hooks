import * as React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";

import { useOnClickOutside } from ".";

const { useRef } = React;

describe("useOnClickOutside", () => {
  let renderTestComponent: any;
  let onClick: any;

  beforeAll(() => {
    onClick = jest.fn();

    const TestComponent = () => {
      const ref = useRef(null);

      useOnClickOutside(ref, onClick);

      return (
        <div data-testid="outer-layer">
          <div ref={ref}>
            <div data-testid="inner-layer">Click me</div>
          </div>
        </div>
      );
    };

    renderTestComponent = () => render(<TestComponent />);
  });

  afterEach(() => {
    cleanup();
    onClick.mockClear();
  });

  describe("when events happen on outside layer", () => {
    it("calls onClick properly", () => {
      const { getByTestId } = renderTestComponent();

      fireEvent.mouseDown(getByTestId("outer-layer"));

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick.mock.calls[0][0].type).toBe("mousedown");

      fireEvent.touchStart(getByTestId("outer-layer"));

      expect(onClick).toHaveBeenCalledTimes(2);
      expect(onClick.mock.calls[1][0].type).toBe("touchstart");
    });
  });

  describe("when events happen on inside layer", () => {
    it("calls onClick properly", () => {
      const { getByTestId } = renderTestComponent();

      fireEvent.mouseDown(getByTestId("inner-layer"));

      expect(onClick).toHaveBeenCalledTimes(0);

      fireEvent.touchStart(getByTestId("inner-layer"));

      expect(onClick).toHaveBeenCalledTimes(0);
    });
  });
});
