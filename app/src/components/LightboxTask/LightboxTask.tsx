import React, { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useGetAllUsersQuery } from '$services/api';
import classNames from 'classnames';
import { InputBase, Box, Typography, MenuItem, CircularProgress, TextField } from '@mui/material';
import LightBox from '$components/Lightbox';
import {
  TASKS_TITLE_MIN_LENGTH,
  TASKS_TITLE_MAX_LENGTH,
  TASKS_DESCRIPTION_MIN_LENGTH,
  TASKS_DESCRIPTION_MAX_LENGTH,
} from '$settings/index';
import { INewNTaskFormState, TCreateElement, TSimpleFunction } from '$types/common';
import css from './LightboxTask.module.scss';

interface IBoardsModal {
  showModal: boolean;
  isLoading: boolean;
  closeModalHandler: TSimpleFunction;
  submitCB: TCreateElement<INewNTaskFormState>;
  modalTitle: string;
  submitButtonText: string;
}

const LightboxTask: FC<IBoardsModal> = ({
  showModal,
  isLoading,
  closeModalHandler,
  submitCB,
  modalTitle,
  submitButtonText,
}) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, errors },
  } = useForm<INewNTaskFormState>({
    defaultValues: {
      title: '',
      description: '',
      userId: '',
    },
  });

  const { data: users = [], isLoading: isLoadingUsers } = useGetAllUsersQuery();

  const addNewBoardHandler: SubmitHandler<INewNTaskFormState> = (data) => {
    submitCB(data);
    reset();
  };

  const closeHandler: TSimpleFunction = () => {
    closeModalHandler();
    reset();
  };

  const classNameSubmit = classNames(css.modalForm_submit, {
    [css.disabled]:
      isLoading ||
      !isDirty ||
      errors?.title?.message ||
      errors?.description?.message ||
      errors?.userId?.message,
  });

  return (
    <LightBox showModal={showModal} closeModalFunction={closeHandler} modalTitle={modalTitle}>
      <Box
        className={css.modalForm}
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit(addNewBoardHandler)}
        noValidate
      >
        <Controller
          control={control}
          name="title"
          rules={{
            required: t('Tasks.errorEmptyField'),
            minLength: {
              value: TASKS_TITLE_MIN_LENGTH,
              message: t('Tasks.errorMinLengthTitle', { TASKS_TITLE_MIN_LENGTH }),
            },
            maxLength: {
              value: TASKS_TITLE_MAX_LENGTH,
              message: t('Tasks.errorMaxLengthTitle', { TASKS_TITLE_MAX_LENGTH }),
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                type="text"
                value={value}
                className={classNames(css.modalForm_element, {
                  [css.error]: error?.message,
                })}
                label={t('Tasks.titleLabelForm')}
                onChange={onChange}
                fullWidth
                autoFocus={true}
              />

              {error?.message && (
                <Typography variant="inherit" component="p" className={css.modalForm_errorText}>
                  {t('Tasks.errorText', { ERROR_MESSAGE: error?.message })}
                </Typography>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="description"
          rules={{
            required: t('Tasks.errorEmptyField'),
            minLength: {
              value: TASKS_DESCRIPTION_MIN_LENGTH,
              message: t('Tasks.errorMinLengthDescription', { TASKS_DESCRIPTION_MIN_LENGTH }),
            },
            maxLength: {
              value: TASKS_DESCRIPTION_MAX_LENGTH,
              message: t('Tasks.errorMaxLengthDescription', { TASKS_DESCRIPTION_MAX_LENGTH }),
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                defaultValue={value}
                className={classNames([css.modalForm_description, css.modalForm_element], {
                  [css.error]: error?.message,
                })}
                label={t('Tasks.descriptionLabelForm')}
                onChange={onChange}
                multiline
                maxRows={5}
                fullWidth
              />

              {error?.message && (
                <Typography variant="inherit" component="p" className={css.modalForm_errorText}>
                  {t('Tasks.errorText', { ERROR_MESSAGE: error?.message })}
                </Typography>
              )}
            </>
          )}
        />

        {isLoadingUsers ? (
          <CircularProgress />
        ) : (
          <Controller
            control={control}
            name="userId"
            rules={{
              required: t('Tasks.errorChoiceUser'),
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextField
                  id="users"
                  select
                  label={t('Tasks.userLabelForm')}
                  value={value}
                  onChange={onChange}
                  className={classNames(css.modalForm_element, {
                    [css.error]: error?.message,
                  })}
                  fullWidth
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.login}
                    </MenuItem>
                  ))}
                </TextField>

                {error?.message && (
                  <Typography variant="inherit" component="p" className={css.modalForm_errorText}>
                    {t('Tasks.errorText', { ERROR_MESSAGE: error?.message })}
                  </Typography>
                )}
              </>
            )}
          />
        )}

        <InputBase
          className={classNameSubmit}
          type="submit"
          disableInjectingGlobalStyles={true}
          disabled={isLoading || !isDirty}
          value={submitButtonText}
          fullWidth={true}
        />
      </Box>
    </LightBox>
  );
};

export default LightboxTask;
