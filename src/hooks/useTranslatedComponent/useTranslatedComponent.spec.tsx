import { cleanup, render } from "@testing-library/react";
import * as React from "react";

import { useTranslatedComponent } from ".";

type FC = React.FC;

describe("useTranslatedComponent", () => {
  let TestComponent: FC;
  let renderComponent: (language: string) => ReturnType<typeof render>;

  const PageRU: FC = () => {
    return <div data-testid="page">PageRU</div>;
  };

  const PageEN: FC = () => {
    return <div data-testid="page">PageEN</div>;
  };

  beforeAll(() => {
    renderComponent = language => {
      TestComponent = () => {
        const TranslatedComponent = useTranslatedComponent({
          language,
          components: { PageRU, PageEN }
        });

        return <TranslatedComponent />;
      };

      return render(<TestComponent />);
    };
  });

  afterEach(cleanup);

  it("throws when there is no appropriate component", () => {
    const language = "fr";

    expect(() => {
      renderComponent(language);
    }).toThrowError(
      `There is no appropriate component for ${language} language`
    );
  });

  it("returns correct component", () => {
    let { getByTestId } = renderComponent("ru");

    let result = (getByTestId("page") as HTMLElement).textContent;
    let expected = "PageRU";

    ({ getByTestId } = renderComponent("en"));

    result = (getByTestId("page") as HTMLElement).textContent;
    expected = "PageRU";

    expect(result).toBe(expected);
  });
});
