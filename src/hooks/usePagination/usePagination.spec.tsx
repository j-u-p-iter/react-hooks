import { cleanup, fireEvent, render } from "@testing-library/react";
import * as React from "react";
import { FC } from "react";

import { usePagination } from ".";

// Testing plan:
// 1. By default (limit = 5, startPage = 1):

// a) Returns properly:
// - currentPage,
// - totalItemsCount,
// - totalPagesCount,
// - nextItemsToShow,
//
// 2. With new passed params (limit = 2, startPage = 2):
// a) Returns properly:
// - currentPage,
// - totalItemsCount,
// - totalPagesCount,
// - nextItemsToShow,
//
// 3. With default values:
//
// a) goToNextPage works properly:
//
// - returns properly:
// -- currentPage,
// -- totalItemsCount,
// -- totalPagesCount,
// -- nextItemsToShow,
//
// b) goToPreviousPage works properly:
//
// - returns properly:
// -- totalItemsCount,
// -- totalPagesCount,
// -- nextItemsToShow,
//
// 4. On first page:
// - goToPreviousPage is equal to noop
//
// 5. On last page:
// - goToNextPage is equal to noop

describe("usePagination", () => {
  let renderTestComponent: any;
  let items: any;

  beforeAll(() => {
    items = [
      { id: 1, value: "some value" },
      { id: 2, value: "some new value" },
      { id: 3, value: "some new value" },
      { id: 4, value: "some value" },
      { id: 5, value: "some new value" },
      { id: 6, value: "some new value" },
      { id: 7, value: "some new value" },
      { id: 8, value: "some new value" }
    ];

    const TestComponent: FC<{ limit: number; startPage: number }> = ({
      limit,
      startPage
    }) => {
      const {
        api: { goToNextPage, goToPreviousPage },
        data: { currentPage, totalItemsCount, totalPagesCount, nextItemsToShow }
      } = usePagination({
        limit,
        startPage,
        items
      });

      return (
        <div>
          <div data-testid="current-page">{currentPage}</div>
          <div data-testid="total-items-count">{totalItemsCount}</div>
          <div data-testid="total-pages-count">{totalPagesCount}</div>
          <div data-testid="first-item-to-show-id">{nextItemsToShow[0].id}</div>
          <div data-testid="last-item-to-show-id">
            {nextItemsToShow[nextItemsToShow.length - 1].id}
          </div>
          <div data-testid="items-to-show-count">{nextItemsToShow.length}</div>

          <button
            data-testid="go-to-previous-page"
            onClick={() => goToPreviousPage()}
          >
            Previous Page
          </button>

          <button data-testid="go-to-next-page" onClick={() => goToNextPage()}>
            Next Page
          </button>
        </div>
      );
    };

    renderTestComponent = (props: any) => render(<TestComponent {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  describe("by default", () => {
    it("return correct data", () => {
      const { getByTestId } = renderTestComponent();

      expect(getByTestId("current-page").textContent).toBe("1");
      expect(getByTestId("total-items-count").textContent).toBe(
        String(items.length)
      );
      expect(getByTestId("total-pages-count").textContent).toBe("2");

      expect(getByTestId("first-item-to-show-id").textContent).toBe("1");
      expect(getByTestId("last-item-to-show-id").textContent).toBe("5");
      expect(getByTestId("items-to-show-count").textContent).toBe("5");
    });
  });

  describe("when predefined limit and startPage", () => {
    it("return correct data", () => {
      const { getByTestId } = renderTestComponent({ limit: 2, startPage: 2 });

      expect(getByTestId("current-page").textContent).toBe("2");
      expect(getByTestId("total-items-count").textContent).toBe(
        String(items.length)
      );
      expect(getByTestId("total-pages-count").textContent).toBe("4");

      expect(getByTestId("first-item-to-show-id").textContent).toBe("3");
      expect(getByTestId("last-item-to-show-id").textContent).toBe("4");
      expect(getByTestId("items-to-show-count").textContent).toBe("2");
    });
  });

  describe("goToNextPage and goToPreviousPage", () => {
    it("works properly", () => {
      const { getByTestId } = renderTestComponent({ limit: 2, startPage: 1 });

      expect(getByTestId("current-page").textContent).toBe("1");
      expect(getByTestId("total-items-count").textContent).toBe(
        String(items.length)
      );
      expect(getByTestId("total-pages-count").textContent).toBe("4");

      expect(getByTestId("first-item-to-show-id").textContent).toBe("1");
      expect(getByTestId("last-item-to-show-id").textContent).toBe("2");
      expect(getByTestId("items-to-show-count").textContent).toBe("2");

      fireEvent.click(getByTestId("go-to-previous-page"));

      expect(getByTestId("current-page").textContent).toBe("1");
      expect(getByTestId("total-items-count").textContent).toBe(
        String(items.length)
      );
      expect(getByTestId("total-pages-count").textContent).toBe("4");

      expect(getByTestId("first-item-to-show-id").textContent).toBe("1");
      expect(getByTestId("last-item-to-show-id").textContent).toBe("2");
      expect(getByTestId("items-to-show-count").textContent).toBe("2");

      fireEvent.click(getByTestId("go-to-next-page"));

      expect(getByTestId("current-page").textContent).toBe("2");
      expect(getByTestId("total-items-count").textContent).toBe(
        String(items.length)
      );
      expect(getByTestId("total-pages-count").textContent).toBe("4");

      expect(getByTestId("first-item-to-show-id").textContent).toBe("3");
      expect(getByTestId("last-item-to-show-id").textContent).toBe("4");
      expect(getByTestId("items-to-show-count").textContent).toBe("2");

      fireEvent.click(getByTestId("go-to-next-page"));

      expect(getByTestId("current-page").textContent).toBe("3");
      expect(getByTestId("total-items-count").textContent).toBe(
        String(items.length)
      );
      expect(getByTestId("total-pages-count").textContent).toBe("4");

      expect(getByTestId("first-item-to-show-id").textContent).toBe("5");
      expect(getByTestId("last-item-to-show-id").textContent).toBe("6");
      expect(getByTestId("items-to-show-count").textContent).toBe("2");

      fireEvent.click(getByTestId("go-to-next-page"));

      expect(getByTestId("current-page").textContent).toBe("4");
      expect(getByTestId("total-items-count").textContent).toBe(
        String(items.length)
      );
      expect(getByTestId("total-pages-count").textContent).toBe("4");

      expect(getByTestId("first-item-to-show-id").textContent).toBe("7");
      expect(getByTestId("last-item-to-show-id").textContent).toBe("8");
      expect(getByTestId("items-to-show-count").textContent).toBe("2");

      fireEvent.click(getByTestId("go-to-next-page"));

      expect(getByTestId("current-page").textContent).toBe("4");
      expect(getByTestId("total-items-count").textContent).toBe(
        String(items.length)
      );
      expect(getByTestId("total-pages-count").textContent).toBe("4");

      expect(getByTestId("first-item-to-show-id").textContent).toBe("7");
      expect(getByTestId("last-item-to-show-id").textContent).toBe("8");
      expect(getByTestId("items-to-show-count").textContent).toBe("2");

      fireEvent.click(getByTestId("go-to-previous-page"));

      expect(getByTestId("current-page").textContent).toBe("3");
      expect(getByTestId("total-items-count").textContent).toBe(
        String(items.length)
      );
      expect(getByTestId("total-pages-count").textContent).toBe("4");

      expect(getByTestId("first-item-to-show-id").textContent).toBe("5");
      expect(getByTestId("last-item-to-show-id").textContent).toBe("6");
      expect(getByTestId("items-to-show-count").textContent).toBe("2");
    });
  });
});
