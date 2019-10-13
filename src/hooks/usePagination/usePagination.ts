import { useState } from "react";

type Items = any[];

interface InitialParams {
  limit: number;
  startPage: number;
  items: Items;
}

interface Result {
  api: {
    goToNextPage: () => void;
    goToPreviousPage: () => void;
  };
  data: {
    currentPage: number;
    totalItemsCount: number;
    totalPagesCount: number;
    nextItemsToShow: Items;
  };
}

type UsePaginationHook = (initialParams: InitialParams) => Result;

const noop = () => {};

type GetItemsToShowFn = (params: {
  items: Items;
  limit: number;
  currentPage: number;
}) => Items;
const getItemsToShow: GetItemsToShowFn = ({ items, limit, currentPage }) => {
  return items.slice(limit * (currentPage - 1), limit * currentPage);
};

export const usePagination: UsePaginationHook = ({
  limit = 5,
  startPage = 1,
  items
}) => {
  const [currentPage, setCurrentPage] = useState(startPage);
  const totalItemsCount = items.length;
  const totalPagesCount = Math.ceil(totalItemsCount / limit);

  const api = {
    goToNextPage:
      currentPage !== totalPagesCount
        ? () => {
            setCurrentPage(currentPage + 1);
          }
        : noop,
    goToPreviousPage:
      currentPage !== 1
        ? () => {
            setCurrentPage(currentPage - 1);
          }
        : noop
  };

  const data = {
    currentPage,
    totalItemsCount,
    totalPagesCount,
    nextItemsToShow: getItemsToShow({ items, limit, currentPage })
  };

  return { api, data };
};
