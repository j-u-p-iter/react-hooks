import * as React from 'react';
import { fireEvent, render } from 'react-testing-library';

import { useListDataManager } from '.';

type RenderComponent = () => ReturnType<typeof render>;

describe('useListDataManager', () => {
  let renderComponent: RenderComponent;
  let listTestId: string;
  let listItemTestId: string;

  beforeAll(() => {
    listTestId = 'list-test-id';
    listItemTestId = 'list-item-test-id';

    const TestComponent: React.FC<{}> = () => {
      const { dataList, addItem, removeItem, updateItem } = useListDataManager<{ id: number; title: string }>();

      return (
        <>
          {dataList.length ? (
            <ul data-testid={listTestId}>
              {dataList.map(({ id, title }) => (
                <li data-test-id={listItemTestId} key={id}>
                  {title}
                  <i data-testid={id} onClick={() => removeItem(id)} />
                </li>
              ))}
            </ul>
          ) : null}

          <button onClick={() => addItem({ id: 1, title: 'First Item' })}>Add First Item</button>

          <button onClick={() => addItem({ id: 2, title: 'Second Item' })}>Add Second Item</button>

          <button onClick={() => addItem({ id: 3, title: 'Third Item' })}>Add Third Item</button>

          <button onClick={() => updateItem({ title: 'First Item New Title' }, 1)}>Update First Item</button>

          <button onClick={() => updateItem({ title: 'Second Item New Title' }, 2)}>Update Second Item</button>
        </>
      );
    };

    renderComponent = () => render(<TestComponent />);
  });

  it('works properly', async () => {
    const { getByText, queryByTestId } = renderComponent();

    // by default list is empty
    const listItems = queryByTestId(listItemTestId);

    expect(listItems).toBe(null);

    // correctly adds new item
    fireEvent.click(getByText('Add First Item') as Element);
    expect(getByText('First Item')).toBeDefined();
    expect((queryByTestId(listTestId) as Element).childElementCount).toBe(1);

    // correctly updates first item
    fireEvent.click(getByText('Update First Item') as Element);
    expect(getByText('First Item New Title')).toBeDefined();
    expect((queryByTestId(listTestId) as Element).childElementCount).toBe(1);

    // correctly adds one more item
    fireEvent.click(getByText('Add Second Item') as Element);
    expect(getByText('Second Item')).toBeDefined();
    expect((queryByTestId(listTestId) as Element).childElementCount).toBe(2);

    // correctly updates second item
    fireEvent.click(getByText('Update Second Item') as Element);
    expect(getByText('Second Item New Title')).toBeDefined();
    expect((queryByTestId(listTestId) as Element).childElementCount).toBe(2);

    // and correctly adds one more item
    fireEvent.click(getByText('Add Third Item') as Element);
    expect(getByText('Third Item')).toBeDefined();

    expect((queryByTestId(listTestId) as Element).childElementCount).toBe(3);

    // correctly removes sedond item
    fireEvent.click(queryByTestId('2') as Element);
    expect(queryByTestId('Second Item')).toBe(null);
    expect((queryByTestId(listTestId) as Element).childElementCount).toBe(2);

    // correctly removes third item
    fireEvent.click(queryByTestId('3') as Element);
    expect(queryByTestId('Third Item')).toBe(null);
    expect((queryByTestId(listTestId) as Element).childElementCount).toBe(1);

    // correctly removes first item
    fireEvent.click(queryByTestId('1') as Element);
    expect(queryByTestId('First Item')).toBe(null);
    expect(queryByTestId(listTestId)).toBe(null);
  });
});
