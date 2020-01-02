import { fireEvent, render } from "@testing-library/react";
import * as React from "react";
import waitForExpect from "wait-for-expect";

import { useDebounce } from ".";

const { useState, useEffect } = React;

describe("useDebounce", () => {
  let TestComponent: any;
  let debouncedValue: number;

  beforeAll(() => {
    TestComponent = ({ handler }: any) => {
      const [value, setValue] = useState(0);

      debouncedValue = useDebounce(value, 1000);

      useEffect(handler, [debouncedValue]);

      return (
        <button onClick={() => setValue(stateValue => stateValue + 1)}>
          Button
        </button>
      );
    };
  });

  // need to test case, when we click only one time
  it("works properly", async () => {
    const handler = jest.fn();

    const { getByText } = render(<TestComponent handler={handler} />);

    fireEvent.click(getByText("Button"));
    fireEvent.click(getByText("Button"));
    fireEvent.click(getByText("Button"));
    fireEvent.click(getByText("Button"));
    fireEvent.click(getByText("Button"));

    expect(handler).toHaveBeenCalledTimes(1);

    await waitForExpect(() => {
      expect(debouncedValue).toBe(5);
    });
  });
});
