import React, { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { InputBase, Box, Typography, TextField } from '@mui/material';
import LightBox from '$components/Lightbox';
import { COLUMNS_TITLE_MIN_LENGTH, COLUMNS_TITLE_MAX_LENGTH } from '$settings/index';
import { IColumnCreateObj, TCreateElement, TSimpleFunction } from '$types/common';
import css from './LightboxColumn.module.scss';

interface IBoardsModal {
  showModal: boolean;
  isLoading: boolean;
  isUpdate?: boolean;
  closeModalHandler: TSimpleFunction;
  submitCB: TCreateElement<IColumnCreateObj>;
  modalTitle: string;
  submitButtonText: string;
  formState: IColumnCreateObj;
}

const LightboxColumn: FC<IBoardsModal> = ({
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
  } = useForm<IColumnCreateObj>({
    defaultValues: formState,
  });
  const { t } = useTranslation();
  const addNewBoardHandler: SubmitHandler<IColumnCreateObj> = (data) => {
    const newData = {
      title: data.title.trim(),
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
            required: t('Columns.errorEmptyField'),
            minLength: {
              value: COLUMNS_TITLE_MIN_LENGTH,
              message: t('Columns.errorMinLengthTitle', { COLUMNS_TITLE_MIN_LENGTH }),
            },
            maxLength: {
              value: COLUMNS_TITLE_MAX_LENGTH,
              message: t('Columns.errorMaxLengthTitle', { COLUMNS_TITLE_MAX_LENGTH }),
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                type="text"
                label={t('Columns.textareaTitleLabelForm')}
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
                  {t('Columns.errorTextarea', { ERROR_MESSAGE: error?.message })}
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

export default LightboxColumn;
