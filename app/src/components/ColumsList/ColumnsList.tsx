import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  api,
  useUpdateDragAndDropColumnMutation,
  useUpdateDragAndDropTaskMutation,
} from '$services/api';
import { useAppSelector } from '$store/store';
import { useSnackbar } from 'notistack';
import classNames from 'classnames';
import { Button, List, ListItem } from '@mui/material';
import ColumnsListItem from './ColumnsListItem';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd';
import Spinner from '$components/Spinner';
import CloseButton from '$components/CloseButton';
import { messageErrorOptions } from '$settings/index';
import { IColumn, IError, ITask, TSimpleFunction } from '$types/common';
import css from './ColumnsList.module.scss';

interface IColumnsListProps {
  columns: Array<IColumn>;
  boardId: string;
  addCardHandler: TSimpleFunction;
  showSpinnerEnd?: boolean;
}

const ColumnsList: FC<IColumnsListProps> = ({
  columns,
  addCardHandler,
  boardId,
  showSpinnerEnd = false,
}) => {
  const { t } = useTranslation();
  const langRef = useRef(t);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const state = useAppSelector((state) => state);

  let allTasksArray: ITask[] = [];
  const columnsId: string[] = columns.map((item) => item.id);
  columnsId.forEach((columnId) => {
    const result = api.endpoints.getAllTasks.select({ boardId, columnId })(state);
    if (result.isSuccess) {
      result.data.forEach((data) => (allTasksArray = [...allTasksArray, data]));
    }
  });

  const [updateColumn, { isLoading: isLoadingUpdateColumn, error: errorChangeOrderColumn }] =
    useUpdateDragAndDropColumnMutation();
  const [updateTask, { error: errorChangeOrderTask }] = useUpdateDragAndDropTaskMutation();

  // show change column order error message
  useEffect(() => {
    if (errorChangeOrderColumn) {
      const errorMessage = langRef.current('Columns.dragDropError', {
        ERROR_MESSAGE: (errorChangeOrderColumn as IError).data.message || '',
      });
      enqueueSnackbar(errorMessage, {
        ...messageErrorOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [errorChangeOrderColumn, langRef, enqueueSnackbar, closeSnackbar]);

  // show change task order error message
  useEffect(() => {
    if (errorChangeOrderTask) {
      const errorMessage = langRef.current('Tasks.dragDropError', {
        ERROR_MESSAGE: (errorChangeOrderTask as IError).data.message || '',
      });
      enqueueSnackbar(errorMessage, {
        ...messageErrorOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [errorChangeOrderTask, langRef, enqueueSnackbar, closeSnackbar]);

  const dragEndListItemHandler = (result: DropResult) => {
    if (!result.destination) return;
    if (result.type === 'COLUMN') {
      const newOrder = result.destination.index;
      const columnId = result.draggableId;
      const columnDrag = columns.filter((oneColumn) => oneColumn.id === columnId)[0];

      if (newOrder === result.source.index) return;

      updateColumn({
        boardId,
        columnId: columnId,
        body: {
          title: columnDrag.title,
          order: newOrder,
        },
      });
    } else if (result.type === 'TASK') {
      let newOrder = result.destination.index;
      if (newOrder < 1) {
        newOrder = 1;
      }
      const newColumn = result.destination.droppableId;
      const taskId = result.draggableId;
      const taskDrag = allTasksArray.filter((oneTask) => oneTask.id === taskId)[0];

      updateTask({
        body: {
          title: taskDrag.title,
          order: newOrder,
          description: taskDrag.description,
          userId: taskDrag.userId,
          boardId: taskDrag.boardId,
          columnId: newColumn,
        },
        boardId: taskDrag.boardId,
        columnId: taskDrag.columnId,
        taskId: taskDrag.id,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={dragEndListItemHandler}>
      <Droppable droppableId="kanbanList" type="COLUMN" direction="horizontal">
        {(droppableColumnProvided: DroppableProvided) => (
          <List
            component="ul"
            className={css.columnsList}
            ref={droppableColumnProvided.innerRef}
            {...droppableColumnProvided.droppableProps}
          >
            {columns.map((columnItem: IColumn) => (
              <Draggable
                key={columnItem.id}
                draggableId={columnItem.id}
                index={columnItem.order}
                isDragDisabled={isLoadingUpdateColumn}
              >
                {(draggableColumnProvided: DraggableProvided) => (
                  <ColumnsListItem
                    {...columnItem}
                    draggableColumnProvided={draggableColumnProvided}
                    boardId={boardId}
                  />
                )}
              </Draggable>
            ))}

            {droppableColumnProvided.placeholder}

            <>
              {showSpinnerEnd && (
                <ListItem component="li" className={css.columnsList__itemButton}>
                  <Spinner size={50} />
                </ListItem>
              )}
            </>

            <ListItem component="li" className={css.columnsList__itemButton}>
              <Button
                className={classNames(css.columnsList__item_addButton, {
                  [css.disabled]: showSpinnerEnd,
                })}
                onClick={addCardHandler}
                disabled={showSpinnerEnd}
              >
                + {t('Columns.addNewColumnButtonText')}
              </Button>
            </ListItem>
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ColumnsList;
