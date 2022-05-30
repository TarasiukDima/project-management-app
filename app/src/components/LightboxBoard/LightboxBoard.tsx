import React, { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { InputBase, Box, Typography, TextField } from '@mui/material';
import LightBox from '$components/Lightbox';
import {
  BOARDS_TITLE_MIN_LENGTH,
  BOARDS_TITLE_MAX_LENGTH,
  BOARDS_DESCRIPTION_MIN_LENGTH,
  BOARDS_DESCRIPTION_MAX_LENGTH,
} from '$settings/index';
import { IBoardCreateObj, TCreateElement, TSimpleFunction } from '$types/common';
import css from './LightboxBoard.module.scss';

interface IBoardsModal {
  showModal: boolean;
  isLoading: boolean;
  isUpdate?: boolean;
  closeModalHandler: TSimpleFunction;
  submitCB: TCreateElement<IBoardCreateObj>;
  modalTitle: string;
  submitButtonText: string;
  formState: IBoardCreateObj;
}

const LightboxBoard: FC<IBoardsModal> = ({
  showModal,
  isLoading,
  isUpdate = false,
  closeModalHandler,
  submitCB,
  modalTitle,
  submitButtonText,
  formState,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, errors },
  } = useForm<IBoardCreateObj>({
    defaultValues: formState,
  });
  const { t } = useTranslation();
  const addNewBoardHandler: SubmitHandler<IBoardCreateObj> = (data) => {
    const newData = {
      title: data.title.trim(),
      description: data.description.trim(),
    };
    submitCB(newData);

    if (isUpdate) {
      reset(newData);
    } else {
      reset();
    }
  };

  const closeHandler: TSimpleFunction = () => {
    closeModalHandler();
    reset();
  };

  const classNameSubmit = classNames(css.modalForm_submit, {
    [css.disabled]: isLoading || !isDirty || errors.title?.message,
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
            required: t('Boards.errorEmptyField'),
            minLength: {
              value: BOARDS_TITLE_MIN_LENGTH,
              message: t('Boards.errorMinLengthTitle', { BOARDS_TITLE_MIN_LENGTH }),
            },
            maxLength: {
              value: BOARDS_TITLE_MAX_LENGTH,
              message: t('Boards.errorMaxLengthTitle', { BOARDS_TITLE_MAX_LENGTH }),
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                type="text"
                label={t('Boards.titleLabelAddForm')}
                value={value}
                onChange={onChange}
                className={classNames(css.modalForm_text, {
                  [css.error]: !!error?.message,
                })}
                fullWidth
                autoFocus={true}
              />

              {error?.message && (
                <Typography variant="inherit" component="p" className={css.modalForm_errorText}>
                  {t('Boards.errorTextarea', { ERROR_MESSAGE: error?.message })}
                </Typography>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="description"
          rules={{
            required: t('Boards.errorEmptyField'),
            minLength: {
              value: BOARDS_DESCRIPTION_MIN_LENGTH,
              message: t('Boards.errorMinLengthDescription', { BOARDS_DESCRIPTION_MIN_LENGTH }),
            },
            maxLength: {
              value: BOARDS_DESCRIPTION_MAX_LENGTH,
              message: t('Boards.errorMaxLengthDescription', { BOARDS_DESCRIPTION_MAX_LENGTH }),
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                type="text"
                label={t('Boards.descriptionLabelAddForm')}
                defaultValue={value}
                onChange={onChange}
                className={classNames(css.modalForm_text, {
                  [css.error]: !!error?.message,
                })}
                multiline
                maxRows={5}
                fullWidth
              />

              {error?.message && (
                <Typography variant="inherit" component="p" className={css.modalForm_errorText}>
                  {t('Boards.errorTextarea', { ERROR_MESSAGE: error?.message })}
                </Typography>
              )}
            </>
          )}
        />

        <InputBase
          className={classNameSubmit}
          type="submit"
          disableInjectingGlobalStyles={true}
          disabled={isLoading || !isDirty}
          value={submitButtonText}
        />
      </Box>
    </LightBox>
  );
};

export default LightboxBoard;
