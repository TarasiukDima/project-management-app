import React, { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddTaskMutation, useGetAllTasksQuery, useDeleteColumnMutation } from '$services/api';
import { useSnackbar } from 'notistack';
import classNames from 'classnames';
import CloseButton from '$components/CloseButton';
import Spinner from '$components/Spinner';
import LightboxTask from '$components/LightboxTask';
import ConfirmWindow from '$components/ConfirmWindow';
import TasksList from './TasksList';
import ColumnsListItemTitle from './ColumnsListItemTitle';
import { Box, Button, IconButton, ListItem } from '@mui/material';
import { DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material';
import { messageErrorOptions, messageSuccessOptions } from '$settings/index';
import { IColumn, IError, INewNTaskFormState, TCreateElement } from '$types/common';
import { DraggableProvided } from 'react-beautiful-dnd';
import css from './ColumnsList.module.scss';

interface IColumnsListItemProps extends IColumn {
  boardId: string;
  draggableColumnProvided: DraggableProvided;
}

const ColumnsListItem: FC<IColumnsListItemProps> = ({
  title,
  boardId,
  id: columnId,
  draggableColumnProvided,
  order,
}) => {
  const { t } = useTranslation();
  const langRef = useRef(t);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isShowConfirmModalDelete, setIsShowConfirmModalDelete] = useState<boolean>(false);
  const [showModalAddTasks, setShowModalAddTasks] = useState<boolean>(false);

  const {
    data: tasks = [],
    error: errorGetTasks,
    isLoading: isLoadingTasks,
  } = useGetAllTasksQuery({ boardId, columnId });
  const [addTask, { isLoading: isAddingTask, error: errorAddTask, isSuccess: isSuccessAddTask }] =
    useAddTaskMutation();
  const [deleteColumn, { error: errorDeleteColumn, isSuccess: isSuccessDeleteColumn }] =
    useDeleteColumnMutation();

  // show get tasks error message
  useEffect(() => {
    if (errorGetTasks) {
      const errorMessage = langRef.current('Tasks.errorGetTasks', {
        ERROR_MESSAGE: (errorGetTasks as IError).data.message || '',
      });
      enqueueSnackbar(errorMessage, {
        ...messageErrorOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [errorGetTasks, langRef, enqueueSnackbar, closeSnackbar]);

  // show add task error message
  useEffect(() => {
    if (errorAddTask) {
      const errorMessage = langRef.current('Tasks.errorAddTask', {
        ERROR_MESSAGE: (errorAddTask as IError).data.message || '',
      });
      enqueueSnackbar(errorMessage, {
        ...messageErrorOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [errorAddTask, langRef, enqueueSnackbar, closeSnackbar]);

  // show add task success message
  useEffect(() => {
    if (isSuccessAddTask) {
      enqueueSnackbar(langRef.current('Tasks.isSuccessAddTask'), {
        ...messageSuccessOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [isSuccessAddTask, langRef, enqueueSnackbar, closeSnackbar]);

  // show delete column error message
  useEffect(() => {
    if (errorDeleteColumn) {
      const errorMessage = langRef.current('Columns.errorDeleteColumn', {
        ERROR_MESSAGE: (errorDeleteColumn as IError).data.message || '',
      });
      enqueueSnackbar(errorMessage, {
        ...messageErrorOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [errorDeleteColumn, closeSnackbar, enqueueSnackbar, langRef]);

  // show delete column success message
  useEffect(() => {
    if (isSuccessDeleteColumn) {
      enqueueSnackbar(langRef.current('Columns.successDeleteColumn'), {
        ...messageSuccessOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [isSuccessDeleteColumn, closeSnackbar, enqueueSnackbar, langRef]);

  const addNewBoard: TCreateElement<INewNTaskFormState> = (data: INewNTaskFormState) => {
    addTask({
      body: data,
      boardId,
      columnId,
    });
    setShowModalAddTasks(false);
  };

  const removeHandler = async () => {
    deleteColumn({ boardId, columnId });
    setIsShowConfirmModalDelete(false);
  };

  return (
    <>
      <ListItem
        component="li"
        className={css.columnsList__item}
        ref={draggableColumnProvided.innerRef}
        {...draggableColumnProvided.draggableProps}
        {...draggableColumnProvided.dragHandleProps}
      >
        <ColumnsListItemTitle title={title} order={order} boardId={boardId} columnId={columnId} />

        {isLoadingTasks ? (
          <Spinner size={30} />
        ) : (
          <>
            <TasksList tasks={tasks} columnId={columnId} />

            <>{isAddingTask && <Spinner size={30} />}</>

            <Box className={css.columnsList__buttonsWrapper}>
              <Button
                className={classNames(css.columnsList__item_addTaskButton, {
                  [css.disabled]: isAddingTask,
                })}
                onClick={() => {
                  setShowModalAddTasks(true);
                }}
                disabled={isAddingTask}
              >
                + {t('Tasks.addNewTaskButtonText')}
              </Button>

              <IconButton
                className={css.columnList_item_delete_button}
                size="small"
                onClick={() => setIsShowConfirmModalDelete(true)}
                aria-label={t('Boards.deleteColumnLabel')}
                disabled={isAddingTask}
              >
                <DeleteOutlineIcon color="inherit" />
              </IconButton>
            </Box>
          </>
        )}
      </ListItem>

      <ConfirmWindow
        isShow={isShowConfirmModalDelete}
        title={t('Columns.confirmDeleteColumnModalTitle')}
        disAgreeHandler={() => setIsShowConfirmModalDelete(false)}
        agreeHandler={removeHandler}
      />

      <LightboxTask
        showModal={showModalAddTasks}
        isLoading={isAddingTask}
        closeModalHandler={() => setShowModalAddTasks(false)}
        submitCB={addNewBoard}
        modalTitle={t('Tasks.createModalTitle')}
        submitButtonText={t('Tasks.submitButtonTextAddTaskForm')}
      />
    </>
  );
};

export default React.memo(ColumnsListItem);
