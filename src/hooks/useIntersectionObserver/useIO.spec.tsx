import { cleanup, fireEvent, render } from "@testing-library/react";
import * as React from "react";
import waitForExpect from "wait-for-expect";
import { useIO } from ".";
import {
  addMock,
  mockIsIntersecting,
  removeMock
} from "./IntersectionObserverMock";

const useEffect = React.useEffect;

const CLASS_NAME = "element-to-observe";
const RESULT_ELEMENT_TEST_ID = "result-element";
const INTERSECT_ALL_TEST_ID = "intersect-all";

describe("useIO", () => {
  let renderComponent: any;

  beforeAll(() => {
    addMock();

    const TestComponent: React.FC<any> = ({ toRender }) => {
      const intersectAll = () => {
        mockIsIntersecting(document.querySelectorAll(`.${CLASS_NAME}`), true);
      };

      const { setElements, entries } = useIO();

      useEffect(() => {
        const elements = document.querySelectorAll(`.${CLASS_NAME}`);

        setElements(elements);
      }, []);

      return (
        <>
          {toRender()}

          {entries.map(({ isIntersecting, target }, index) => {
            return isIntersecting ? (
              <div key={index} data-testid={RESULT_ELEMENT_TEST_ID}>
                {target.textContent}
              </div>
            ) : null;
          })}

          <button data-testid={INTERSECT_ALL_TEST_ID} onClick={intersectAll}>
            Mock
          </button>
        </>
      );
    };

    renderComponent = toRender => {
      return render(<TestComponent toRender={toRender} />);
    };
  });

  afterAll(() => {
    removeMock();
  });

  afterEach(cleanup);

  it("two elements are visible", async () => {
    const { getByTestId, queryAllByTestId } = renderComponent(() => {
      return (
        <>
          <div className={CLASS_NAME}>hello1</div>
          <div className={CLASS_NAME}>hello2</div>
        </>
      );
    });

    fireEvent.click(getByTestId(INTERSECT_ALL_TEST_ID));

    await waitForExpect(() => {
      expect(queryAllByTestId(RESULT_ELEMENT_TEST_ID).length).toBe(2);
      expect(queryAllByTestId(RESULT_ELEMENT_TEST_ID)[0].textContent).toBe(
        "hello1"
      );
      expect(queryAllByTestId(RESULT_ELEMENT_TEST_ID)[1].textContent).toBe(
        "hello2"
      );
    });
  });

  it("one element is visible", async () => {
    const { getByTestId, queryAllByTestId } = renderComponent(() => {
      return <div className={CLASS_NAME}>hello</div>;
    });

    fireEvent.click(getByTestId(INTERSECT_ALL_TEST_ID));

    await waitForExpect(() => {
      expect(queryAllByTestId(RESULT_ELEMENT_TEST_ID).length).toBe(1);
      expect(queryAllByTestId(RESULT_ELEMENT_TEST_ID)[0].textContent).toBe(
        "hello"
      );
    });
  });
});
