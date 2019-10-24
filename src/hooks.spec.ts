import { hooks } from ".";

describe("hooks", () => {
  it("are exported properly", () => {
    expect(hooks.useShallowMergeReducer).toBeDefined();
    expect(hooks.useDebounce).toBeDefined();
    expect(hooks.useListDataManager).toBeDefined();
    expect(hooks.useOnClickOutside).toBeDefined();
    expect(hooks.useLocalStorage).toBeDefined();
    expect(hooks.useEventListener).toBeDefined();
    expect(hooks.useDIC).toBeDefined();
    expect(hooks.useTranslatedComponent).toBeDefined();
  });
});
