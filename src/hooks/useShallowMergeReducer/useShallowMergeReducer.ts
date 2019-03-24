import { useReducer as useOriginalReducer } from "react";

export const useShallowMergeReducer = (initialState: {
  [key: string]: any;
}): ReturnType<typeof useOriginalReducer> =>
  useOriginalReducer(
    (state, originalNewState) => ({ ...state, ...originalNewState }),
    initialState
  );
