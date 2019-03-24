import { hooks } from ".";

describe("hooks", () => {
  it("are defined properly", () => {
    expect(hooks.useShallowMergeReducer).toBeDefined();
  });
});
