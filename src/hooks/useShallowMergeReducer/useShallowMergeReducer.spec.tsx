import * as React from "react";
import { fireEvent, render } from "react-testing-library";

import { useShallowMergeReducer } from ".";

describe("useShallowMergeReducer", () => {
  let TestComponent: any;

  beforeAll(() => {
    TestComponent = () => {
      const [{ first, second }, setState] = useShallowMergeReducer({
        first: 1,
        second: 2
      });

      const onIncrementFirstProp = () => setState({ first: first + 1 });
      const onIncrementSecondProp = () => setState({ second: second + 1 });

      return (
        <>
          <button
            data-testid="increment-first-prop"
            onClick={onIncrementFirstProp}
          >
            Increment firstProp
          </button>
          <button
            data-testid="increment-second-prop"
            onClick={onIncrementSecondProp}
          >
            Increment secondProp
          </button>
          <div>
            <div data-testid="first-prop-value">{first}</div>
            <div data-testid="second-prop-value">{second}</div>
          </div>
        </>
      );
    };
  });

  it("merges state properly", () => {
    const { getByTestId } = render(<TestComponent />);

    fireEvent.click(getByTestId("increment-first-prop"));
    expect(Number(getByTestId("first-prop-value").innerHTML)).toBe(2);
    expect(Number(getByTestId("second-prop-value").innerHTML)).toBe(2);

    fireEvent.click(getByTestId("increment-second-prop"));
    expect(Number(getByTestId("first-prop-value").innerHTML)).toBe(2);
    expect(Number(getByTestId("second-prop-value").innerHTML)).toBe(3);
  });
});
