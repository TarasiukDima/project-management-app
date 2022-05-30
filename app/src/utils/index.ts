import { LANGUAGE_LOCALSTORAGE } from '$settings/index';
import { APP_LANGUAGES } from '$settings/index';
import { IColumn, IBoard, ITask } from '$types/common';

type TRandNumber = (max: number, min?: number) => number;
type TSortArray<T> = (array: T) => T;

export const randNumber: TRandNumber = (max, min = 0) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getSortBoards: TSortArray<Array<IBoard>> = (boards: Array<IBoard>) => {
  const sortingBoards = [...boards].sort((el1: IBoard, el2: IBoard) =>
    el1.title > el2.title ? 1 : -1
  );
  return sortingBoards;
};

export const getSortColumns: TSortArray<Array<IColumn>> = (columns: Array<IColumn>) => {
  const sortingColumns = [...columns].sort((el1: IColumn, el2: IColumn) => el1.order - el2.order);
  return sortingColumns;
};

export const getSortTasks: TSortArray<Array<ITask>> = (tasks: Array<ITask>) => {
  const sortingTasks = [...tasks].sort((el1: ITask, el2: ITask) => el1.order - el2.order);
  return sortingTasks;
};

export const importAllFiles = (r: __WebpackModuleApi.RequireContext): Array<string> => {
  return r.keys().map(r) as Array<string>;
};

export const getStorageLanguage = (): string => {
  const localstorageLanguage = localStorage.getItem(LANGUAGE_LOCALSTORAGE) || '';
  if (APP_LANGUAGES.includes(localstorageLanguage)) {
    return localstorageLanguage;
  }
  return 'en';
};
