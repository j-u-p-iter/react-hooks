import { useState } from "react";

export const useListDataManager = () => {
  const [dataList, setListData] = useState<any[]>([]);

  const addItem = (item: any) => {
    setListData(state => [...state, item]);
  };

  const removeItem = (itemToDeleteId: any) =>
    setListData(dataList.filter(({ id: itemId }) => itemId !== itemToDeleteId));

  return {
    dataList,
    addItem,
    removeItem
  };
};
