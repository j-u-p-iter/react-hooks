import { useState } from 'react';


export const useListDataManager = () => {
  const [dataList, setListData] = useState([]);
  
  const addItem = (item: any) => {
    dataList.push(item); 

    setListData(dataList);
  };

  const removeItem = (itemToDeleteId: any) => (
    setListData(dataList.filter(({ id: itemId }) => itemId !== itemToDeleteId))
  );

  return {
    dataList,
    addItem,
    removeItem
  };
};
