import { fireEvent, render } from "@testing-library/react";
import * as React from "react";

import { useTitle } from ".";

describe("useTitle", () => {
  let renderComponent: any;

  beforeAll(() => {
    const TestComponent = () => {
      const setTitle = useTitle("originalTitle");

      return (
        <div>
          <button onClick={() => setTitle("someNewTitle")}>
            Some new title
          </button>
        </div>
      );
    };

    renderComponent = () => render(<TestComponent />);
  });

  it("works properly", () => {
    const { getByText } = renderComponent();

    expect(document.title).toBe("originalTitle");

    const button = getByText("Some new title");

    fireEvent.click(button);

    expect(document.title).toBe("someNewTitle");
  });
});
