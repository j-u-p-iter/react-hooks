import * as React from "react";
import { createContext, FC, useContext } from "react";

type Dependencies = Array<{
  name: string;
  dependency: string;
}>;

type DependenciesList = string[];

type Params = Dependencies | DependenciesList;

const Context = createContext<Dependencies | null>(null);

type UseDIC = (
  params: Params
) => { DICProvider: FC; dependencies: { [key: string]: any } };
export const useDIC: UseDIC = dependencies => {
  const isInitialStep = typeof dependencies[0] === "object";

  let DICProvider: FC = () => null;

  if (isInitialStep) {
    DICProvider = ({ children }) => {
      return (
        <Context.Provider value={dependencies as Dependencies}>
          {children}
        </Context.Provider>
      );
    };
  }

  const dependenciesFromContext: Dependencies | null = useContext(Context);
  let filteredResult = {};

  if (dependenciesFromContext && !isInitialStep) {
    filteredResult = dependenciesFromContext
      .filter(({ name }) => {
        return (dependencies as DependenciesList).includes(name);
      })
      .reduce<{ [key: string]: any }>((result, { name, dependency }) => {
        result[name] = dependency;

        return result;
      }, {});
  }

  return {
    DICProvider,
    dependencies: filteredResult
  };
};
