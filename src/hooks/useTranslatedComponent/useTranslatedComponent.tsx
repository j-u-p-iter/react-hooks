import * as React from "react";

type FC = React.FC;

export type UseTranslatedComponent = (params: {
  components: { [key: string]: FC };
  language: string;
}) => FC;
export const useTranslatedComponent: UseTranslatedComponent = ({
  components,
  language
}) => {
  const translatedComponentName = Object.keys(components).find(
    componentName => {
      return new RegExp(`${language.toUpperCase()}$`).test(componentName);
    }
  );

  if (!translatedComponentName) {
    throw new Error(
      `There is no appropriate component for ${language} language`
    );
  }

  return components[translatedComponentName];
};
