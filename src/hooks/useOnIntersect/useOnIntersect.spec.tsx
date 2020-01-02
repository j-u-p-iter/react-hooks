import { cleanup, render, wait } from "@testing-library/react";
import * as React from "react";

import { useOnIntersect } from ".";
import {
  addMock,
  mockIsIntersecting,
  removeMock
} from "../useIntersectionObserver";

describe("useOnIntersect", () => {
  let renderComponent;

  beforeAll(() => {
    const TestComponent: React.FC<any> = ({ elementSelector, onIntersect }) => {
      useOnIntersect({
        elementSelector,
        onIntersect
      });

      return (
        <div>
          <div className="item" />
          <div className="item" />
          <div className="new-item" />
        </div>
      );
    };

    renderComponent = ({ elementSelector, onIntersect }) => {
      return render(
        <TestComponent
          elementSelector={elementSelector}
          onIntersect={onIntersect}
        />
      );
    };

    addMock();
  });

  afterEach(cleanup);

  afterAll(() => {
    removeMock();
  });

  describe("onIntersect", () => {
    describe("without intersected elements", () => {
      it("is not called", async () => {
        const onIntersectMock = jest.fn();

        renderComponent({
          elementSelector: ".item, .new-item",
          onIntersect: onIntersectMock
        });

        mockIsIntersecting(document.querySelectorAll(".new-item"), true);

        await wait(() => {
          expect(onIntersectMock).toBeCalledTimes(1);
        });

        mockIsIntersecting(document.querySelectorAll(".item"), true);

        await wait(() => {
          expect(onIntersectMock).toBeCalledTimes(3);
        });

        mockIsIntersecting(document.querySelectorAll(".new-item"), false);
        mockIsIntersecting(document.querySelectorAll(".new-item"), true);

        await wait(() => {
          expect(onIntersectMock).toBeCalledTimes(4);
        });
      });
    });
  });
});
