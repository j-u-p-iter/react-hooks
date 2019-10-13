import { useState } from "react";

interface RequiredParams {
  id: number;
}

type Item<ItemData> = ItemData & RequiredParams;

export const useListDataManager = <ItemData>(
  defaultDataList: Array<Item<ItemData>> = []
) => {
  const [dataList, setListData] = useState<Array<Item<ItemData>>>(
    defaultDataList
  );

  const addItem = (item: Item<ItemData>) => {
    setListData(state => [...state, item]);
  };

  const updateItem = (
    dataToUpdate: Partial<Item<ItemData>>,
    itemToUpdateId: Item<ItemData>["id"]
  ) => {
    return setListData(
      dataList.map(itemData => {
        const { id: itemId } = itemData;

        return itemId === itemToUpdateId
          ? {
              ...itemData,
              ...dataToUpdate
            }
          : itemData;
      })
    );
  };

  const removeItem = (itemToDeleteId: Item<ItemData>["id"]) =>
    setListData(dataList.filter(({ id: itemId }) => itemId !== itemToDeleteId));

  return {
    dataList,
    addItem,
    updateItem,
    removeItem
  };
};
