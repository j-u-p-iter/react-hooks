import * as React from "react";
import { render } from "react-testing-library";
import { useDIC } from ".";

describe("useDIC", () => {
  let TestComponent: React.FC;

  beforeAll(() => {
    const SomeComponent = () => {
      const {
        DICProvider,
        dependencies: [{ name }]
      } = useDIC(["hello"]);

      return (
        <>
          <DICProvider>
            <div data-testid="dicProvider" />
          </DICProvider>
          <div data-testid={name}>Hello</div>;
        </>
      );
    };

    TestComponent = () => {
      const { DICProvider } = useDIC([
        { name: "hello", dependency: "some" },
        { name: "oneMoreHello", dependency: "oneMoreSome" }
      ]);

      return (
        <DICProvider>
          <div>
            <SomeComponent />
          </div>
        </DICProvider>
      );
    };
  });
  it("pass dependencies properly", () => {
    const { getByTestId } = render(<TestComponent />);

    const result = getByTestId("hello").textContent;
    const expected = "Hello";

    expect(result).toBe(expected);
  });

  it("do not create provider when we get dependencies", () => {
    const { queryByTestId } = render(<TestComponent />);

    const result = queryByTestId("dicProvider");
    const expected = null;

    expect(result).toBe(expected);
  });
});
