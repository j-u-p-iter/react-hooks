import * as React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";

import { useLocalStorage } from ".";

describe("useLocalStorage", () => {
  let TestComponent: any;
  let localStorageKey: any;
  let renderComponent: any;
  let storedValueTestId: any;
  let initialValue: any;

  beforeAll(() => {
    localStorageKey = "someLocalStorageKey";
    storedValueTestId = "storedValue";
    initialValue = "someInitialValue";

    TestComponent = ({ children }: any) => {
      const [storedValue, storeValue] = useLocalStorage(
        localStorageKey,
        initialValue
      );

      return children({ storedValue, storeValue });
    };

    renderComponent = ({ valueToSave }: any = {}) =>
      render(
        <TestComponent>
          {({ storedValue, storeValue }: any) => (
            <>
              <span data-testid={storedValueTestId} data-stored={storedValue} />
              <button onClick={() => storeValue(valueToSave)}>Save</button>
            </>
          )}
        </TestComponent>
      );
  });

  afterEach(cleanup);

  describe("without predefined value in localStorage", () => {
    it("returns correct value", () => {
      const { getByTestId } = renderComponent();

      expect(getByTestId(storedValueTestId).dataset.stored).toBe(initialValue);
    });
  });

  describe("with predefined value in localStorage", () => {
    let predefinedValue: any;

    beforeEach(() => {
      predefinedValue = "somePredefinedValue";

      localStorage.setItem(localStorageKey, JSON.stringify(predefinedValue));
    });

    it("returns correct value", () => {
      const { getByTestId } = renderComponent();

      expect(getByTestId(storedValueTestId).dataset.stored).toBe(
        predefinedValue
      );
    });
  });

  describe("with value as plain string", () => {
    let valueToSave: any;

    beforeEach(() => {
      valueToSave = "someString";
    });

    it("saves correctly", () => {
      const { getByTestId, getByText } = renderComponent({ valueToSave });

      const button = getByText("Save");

      fireEvent.click(button);

      expect(JSON.parse(localStorage.getItem(localStorageKey) as string)).toBe(
        valueToSave
      );
      expect(getByTestId(storedValueTestId).dataset.stored).toBe(valueToSave);
    });
  });

  describe("with value as function", () => {
    let valueToSave: () => string;

    beforeEach(() => {
      valueToSave = () => "someValueReturnedFromFunction";
    });

    it("saves correctly", () => {
      const { getByTestId, getByText } = renderComponent({ valueToSave });

      const button = getByText("Save");

      fireEvent.click(button);

      expect(JSON.parse(localStorage.getItem(localStorageKey) as string)).toBe(
        valueToSave()
      );
      expect(getByTestId(storedValueTestId).dataset.stored).toBe(valueToSave());
    });
  });
});
