import { cleanup, render } from "@testing-library/react";
import * as React from "react";

import { addMock, mockIsIntersecting, removeMock } from ".";

describe("IntersectionObserverMock", () => {
  let renderComponent;

  beforeAll(() => {
    const TestComponent = () => {
      return (
        <>
          <div className="item" />
          <div className="item" />
          <div className="new-item" />
        </>
      );
    };

    renderComponent = () => render(<TestComponent />);

    addMock();
  });

  afterAll(() => {
    removeMock();
  });

  afterEach(cleanup);

  describe("IntersectionObserverMock", () => {
    it("declared", () => {
      expect(IntersectionObserver).toBeDefined();
    });
  });

  describe("mockInIntersecting", () => {
    it("throws if IntersectionObserverCallback is not initialized", () => {
      renderComponent();

      expect(() =>
        mockIsIntersecting(document.querySelectorAll(".item"), false)
      ).toThrow("You should initialize IntersectionObserver at first!");
    });

    it("throws for element, that is not observed", () => {
      renderComponent();

      const io = new IntersectionObserver(() => {});

      Array.from(document.querySelectorAll(".item")).forEach(element => {
        io.observe(element);
      });

      expect(() =>
        mockIsIntersecting(document.querySelectorAll(".new-item"), false)
      ).toThrow(
        "This element is absent from observing elements! You should start observing it at first."
      );

      io.disconnect();

      expect(() =>
        mockIsIntersecting(document.querySelectorAll(".item"), false)
      ).toThrow("You should initialize IntersectionObserver at first!");
    });
  });

  describe("observe", () => {
    it("adds element to observed set of elements", () => {
      renderComponent();

      const io = new IntersectionObserver(() => {});

      expect(() =>
        mockIsIntersecting(document.querySelectorAll(".new-item"), false)
      ).toThrow(
        "This element is absent from observing elements! You should start observing it at first."
      );

      io.observe(document.querySelector(".new-item"));

      expect(() =>
        mockIsIntersecting(document.querySelectorAll(".new-item"), false)
      ).not.toThrow();
    });
  });

  describe("unobserve", () => {
    it("removes element to observed set of elements", () => {
      renderComponent();

      const io = new IntersectionObserver(() => {});

      io.observe(document.querySelector(".new-item"));

      expect(() =>
        mockIsIntersecting(document.querySelectorAll(".new-item"), false)
      ).not.toThrow();

      io.unobserve(document.querySelector(".new-item"));

      expect(() =>
        mockIsIntersecting(document.querySelectorAll(".new-item"), false)
      ).toThrow(
        "This element is absent from observing elements! You should start observing it at first."
      );
    });
  });

  describe("disconnect", () => {
    it("removes initial callback", () => {
      renderComponent();

      const io = new IntersectionObserver(() => {});

      io.observe(document.querySelector(".new-item"));

      expect(() =>
        mockIsIntersecting(document.querySelectorAll(".new-item"), false)
      ).not.toThrow();

      io.disconnect();

      expect(() =>
        mockIsIntersecting(document.querySelectorAll(".item"), false)
      ).toThrow("You should initialize IntersectionObserver at first!");
    });
  });
});
