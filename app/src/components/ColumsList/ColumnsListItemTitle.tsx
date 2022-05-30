import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateColumnMutation } from '$services/api';
import { useSnackbar } from 'notistack';
import CloseButton from '$components/CloseButton';
import { Box, Button, ButtonGroup, InputBase, Stack, Typography } from '@mui/material';
import { Check as CheckIcon, DoNotDisturb as DoNotDisturbIcon } from '@mui/icons-material';
import {
  COLUMNS_TITLE_MAX_LENGTH,
  COLUMNS_TITLE_MIN_LENGTH,
  messageErrorOptions,
  messageSuccessOptions,
} from '$settings/index';
import { IColumn, IError, TSimpleFunction } from '$types/common';
import css from './ColumnsList.module.scss';
import Spinner from '$components/Spinner';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface IColumnsListItemTitleProps extends Omit<IColumn, 'id'> {
  title: string;
  boardId: string;
  columnId: string;
}
interface IColumnsListItemTitleFormState {
  title: string;
}

const ColumnsListItemTitle: FC<IColumnsListItemTitleProps> = ({
  title,
  order,
  boardId,
  columnId,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isChangeColumnNameMode, setIsChangeColumnNameMode] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IColumnsListItemTitleFormState>({
    defaultValues: { title },
    mode: 'onChange',
  });
  const [
    updateColumn,
    { error: errorUpdateColumn, isSuccess: isSuccessUpdateColumn, isLoading: isUpdateTitle },
  ] = useUpdateColumnMutation();

  // show update column error message
  useEffect(() => {
    if (errorUpdateColumn) {
      const errorMessage = t('Columns.errorUpdateColumnTitle', {
        ERROR_MESSAGE: (errorUpdateColumn as IError).data.message || '',
      });
      enqueueSnackbar(errorMessage, {
        ...messageErrorOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [errorUpdateColumn, closeSnackbar, enqueueSnackbar, t]);

  // show update column success message
  useEffect(() => {
    if (isSuccessUpdateColumn) {
      enqueueSnackbar(t('Columns.successUpdateColumnTitle'), {
        ...messageSuccessOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [isSuccessUpdateColumn, closeSnackbar, enqueueSnackbar, t]);

  const cancelTitleHandler: TSimpleFunction = () => {
    setIsChangeColumnNameMode(false);
    reset({ title });
  };

  const submitTitleHandler: SubmitHandler<IColumnsListItemTitleFormState> = (data) => {
    if (data.title !== title) {
      updateColumn({ body: { title: data.title, order }, boardId, columnId });
    }
    setIsChangeColumnNameMode(false);
  };

  return (
    <>
      {isChangeColumnNameMode ? (
        <>
          <Stack className={css.columnsList__item_rename}>
            <Box
              className={css.columnsList__item_form}
              component="form"
              autoComplete="off"
              onSubmit={handleSubmit(submitTitleHandler)}
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
                render={({ field: { ...field } }) => (
                  <InputBase
                    className={css.columnsList__item_rename_input}
                    {...field}
                    placeholder={t('Columns.errorEmptyField')}
                    aria-label={t('Columns.updateColumnTitleLabel')}
                  />
                )}
              />
            </Box>

            <ButtonGroup className={css.columnsList__item_rename_buttons}>
              <Button
                className={css.columnsList__item_rename_accept}
                onClick={handleSubmit(submitTitleHandler)}
                disabled={!!errors?.title?.message}
                aria-label={t('Columns.changeTitleConfirm')}
              >
                <CheckIcon />
              </Button>

              <Button
                className={css.columnsList__item_rename_cancel}
                aria-label={t('Columns.changeTitleCancel')}
                onClick={cancelTitleHandler}
              >
                <DoNotDisturbIcon />
              </Button>
            </ButtonGroup>
          </Stack>

          <>
            {errors?.title?.message && (
              <Typography
                className={css.columnsList__item_renameErrorText}
                variant="inherit"
                component="p"
              >
                {errors.title.message}
              </Typography>
            )}
          </>
        </>
      ) : (
        <>
          {isUpdateTitle ? (
            <Spinner size={30} />
          ) : (
            <Typography
              className={css.columnsList__item_title}
              gutterBottom
              variant="inherit"
              component="h3"
              onClick={() => setIsChangeColumnNameMode(true)}
            >
              {title}
            </Typography>
          )}
        </>
      )}
    </>
  );
};

export default ColumnsListItemTitle;
