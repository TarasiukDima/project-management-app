import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetAllUsersQuery,
  useDeleteTaskMutation,
  useUpdateDragAndDropTaskMutation,
} from '$services/api';
import { useSnackbar } from 'notistack';
import { SubmitHandler } from 'react-hook-form';
import { Button, IconButton, ListItem, Stack, Typography } from '@mui/material';
import {
  DeleteOutline as DeleteOutlineIcon,
  HistoryEdu as HistoryEduIcon,
} from '@mui/icons-material';
import CloseButton from '$components/CloseButton';
import ConfirmWindow from '$components/ConfirmWindow';
import LightboxUpdateTask from '$components/LightboxUpdateTask';
import { randNumber } from '$utils/index';
import {
  messageErrorOptions,
  messageSuccessOptions,
  SIZE_DESCRIPTION_TASK_IN_COLUMN,
} from '$settings/index';
import { IError, ITask, ITaskUpdateObj, TSimpleFunction } from '$types/common';
import { DraggableProvided } from 'react-beautiful-dnd';
import css from './TasksList.module.scss';
import classNames from 'classnames';

interface ITasksListItemProps extends ITask {
  draggableTaskProvided: DraggableProvided;
}

const TasksListItem: FC<ITasksListItemProps> = ({
  title,
  description,
  order,
  userId,
  id,
  boardId,
  columnId,
  draggableTaskProvided,
}) => {
  const { t } = useTranslation();
  const langRef = useRef(t);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const unknownUser = t('Tasks.unknownUser');
  const randomColorPart1 = useMemo(() => randNumber(255, 0), []);
  const randomColorPart2 = useMemo(() => randNumber(255, 0), []);
  const randomColorPart3 = useMemo(() => randNumber(255, 0), []);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showUpdateFormModal, setShowUpdateFormModal] = useState<boolean>(false);
  const [isShowConfirmModalDelete, setIsShowConfirmModalDelete] = useState<boolean>(false);

  const { data: users = [], error: errorGetUsers } = useGetAllUsersQuery();
  const [
    updateTask,
    { isLoading: isUpdateTask, error: errorUpdateTask, isSuccess: isSuccessUpdateTask },
  ] = useUpdateDragAndDropTaskMutation();
  const [
    deleteTask,
    { isLoading: isDeleteTask, error: errorDeleteTask, isSuccess: isSuccessDeleteTask },
  ] = useDeleteTaskMutation();

  // show update task error message
  useEffect(() => {
    if (errorUpdateTask) {
      const errorMessage = langRef.current('Tasks.errorUpdateTask', {
        ERROR_MESSAGE: (errorUpdateTask as IError).data.message || '',
      });
      enqueueSnackbar(errorMessage, {
        ...messageErrorOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [errorUpdateTask, closeSnackbar, enqueueSnackbar, langRef]);

  // show update task success message
  useEffect(() => {
    if (isSuccessUpdateTask) {
      enqueueSnackbar(langRef.current('Tasks.successUpdateTask'), {
        ...messageSuccessOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [isSuccessUpdateTask, closeSnackbar, enqueueSnackbar, langRef]);

  // show update task error message
  useEffect(() => {
    if (errorDeleteTask) {
      const errorMessage = langRef.current('Tasks.errorDeleteTask', {
        ERROR_MESSAGE: (errorDeleteTask as IError).data.message || '',
      });
      enqueueSnackbar(errorMessage, {
        ...messageErrorOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [errorDeleteTask, closeSnackbar, enqueueSnackbar, langRef]);

  // show delete task success message
  useEffect(() => {
    if (isSuccessDeleteTask) {
      enqueueSnackbar(langRef.current('Tasks.successDeleteTask'), {
        ...messageSuccessOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [isSuccessDeleteTask, closeSnackbar, enqueueSnackbar, langRef]);

  const getDescription = () => {
    if (description.length > SIZE_DESCRIPTION_TASK_IN_COLUMN) {
      return description.slice(0, SIZE_DESCRIPTION_TASK_IN_COLUMN) + '...';
    }

    return description;
  };

  const getUser = () => {
    const needUserData = users.filter((user) => userId === user.id)[0];
    if (!needUserData) {
      return unknownUser;
    }
    return t('Tasks.responsible', { USER: needUserData.login });
  };

  const updateTaskObj: SubmitHandler<ITaskUpdateObj> = (data) => {
    updateTask({ body: { ...data, boardId, columnId, order }, boardId, columnId, taskId: id });
    setShowUpdateModal(false);
  };

  const removeHandler: TSimpleFunction = async () => {
    deleteTask({ boardId, columnId, taskId: id });
    setIsShowConfirmModalDelete(false);
  };

  const updateModalVisible = (showModal: boolean, showModalLikeForm: boolean): void => {
    setShowUpdateModal(showModal);
    setShowUpdateFormModal(showModalLikeForm);
  };

  return (
    <>
      <ListItem
        component="li"
        className={css.tasksList__item}
        sx={{
          backgroundColor: `rgb(${randomColorPart1}, ${randomColorPart2}, ${randomColorPart3})`,
        }}
        ref={draggableTaskProvided.innerRef}
        {...draggableTaskProvided.draggableProps}
        {...draggableTaskProvided.dragHandleProps}
      >
        <Typography
          className={css.tasksList__item_title}
          gutterBottom
          variant="inherit"
          component="h4"
        >
          {title}
        </Typography>

        <Typography
          className={css.tasksList__item_description}
          gutterBottom
          variant="inherit"
          component="p"
        >
          {getDescription()}
        </Typography>

        <Typography
          className={css.tasksList__item_user}
          gutterBottom
          variant="inherit"
          component="p"
        >
          {errorGetUsers ? unknownUser : getUser()}
        </Typography>

        <Stack direction="row" className={css.tasksList__item_buttonsWrapper}>
          <Button
            className={classNames(css.tasksList__item_openButton, {
              [css.disabled]: isDeleteTask || isUpdateTask,
            })}
            onClick={() => updateModalVisible(true, false)}
            disabled={isDeleteTask || isUpdateTask}
          >
            {t('Tasks.openTaskButton')}
          </Button>

          <IconButton
            className={css.tasksList__item_button}
            size="small"
            onClick={() => updateModalVisible(true, true)}
            aria-label={t('Tasks.updateTaskLabel')}
            disabled={isDeleteTask || isUpdateTask}
          >
            <HistoryEduIcon color="inherit" />
          </IconButton>

          <IconButton
            className={css.tasksList__item_button}
            size="small"
            onClick={() => setIsShowConfirmModalDelete(true)}
            aria-label={t('Tasks.deleteTaskLabel')}
            disabled={isDeleteTask || isUpdateTask}
          >
            <DeleteOutlineIcon color="inherit" />
          </IconButton>
        </Stack>
      </ListItem>

      <ConfirmWindow
        isShow={isShowConfirmModalDelete}
        title={t('Tasks.confirmDeleteTaskModalTitle')}
        disAgreeHandler={() => setIsShowConfirmModalDelete(false)}
        agreeHandler={removeHandler}
      />

      <LightboxUpdateTask
        showModal={showUpdateModal}
        isLoading={isUpdateTask}
        closeModal={() => updateModalVisible(false, false)}
        responsibleUser={errorGetUsers ? unknownUser : getUser()}
        users={users}
        defaultFormState={{
          title,
          description,
          userId,
        }}
        showLikeForm={showUpdateFormModal}
        showForm={() => setShowUpdateFormModal(true)}
        submitCB={updateTaskObj}
      />
    </>
  );
};

export default React.memo(TasksListItem);
