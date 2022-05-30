import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useUpdateBoardMutation, useDeleteBoardMutation } from '$services/api';
import { SubmitHandler } from 'react-hook-form';
import classNames from 'classnames';
import {
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  DeleteOutline as DeleteOutlineIcon,
  HistoryEdu as HistoryEduIcon,
} from '@mui/icons-material';
import CloseButton from '$components/CloseButton';
import LightboxBoard from '$components/LightboxBoard';
import Spinner from '$components/Spinner';
import ConfirmWindow from '$components/ConfirmWindow';
import { importAllFiles, randNumber } from '$utils/index';
import { ROUTES_PATHS } from '$settings/routing';
import { messageErrorOptions, messageSuccessOptions } from '$settings/index';
import { IBoard, IBoardCreateObj, IError } from '$types/common';
import css from './BoardsList.module.scss';

const BoardsListItem: FC<IBoard> = ({ id, title, description }) => {
  const { t } = useTranslation();
  const langRef = useRef(t);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [isShowConfirmModalDelete, setIsShowConfirmModalDelete] = useState<boolean>(false);
  const arrImages = importAllFiles(require.context('$assets/images/backgrounds', false, /\.jpg$/));
  const indexImg = useMemo(() => randNumber(arrImages.length - 1), [arrImages.length]);
  const [
    updateBoard,
    { isLoading: isUpdateBoard, error: errorUpdateBoard, isSuccess: isSuccessUpdateBoard },
  ] = useUpdateBoardMutation();
  const [
    deleteBoard,
    { isLoading: isDeleteBoard, error: errorDeletingBoard, isSuccess: isSuccessDeletingBoard },
  ] = useDeleteBoardMutation();

  // show update board error message
  useEffect(() => {
    if (errorUpdateBoard) {
      const errorMessage = langRef.current('Boards.errorUpdateBoardTitle', {
        ERROR_MESSAGE: (errorUpdateBoard as IError).data.message || '',
      });
      enqueueSnackbar(errorMessage, {
        ...messageErrorOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [errorUpdateBoard, closeSnackbar, enqueueSnackbar, langRef]);

  // show update board success message
  useEffect(() => {
    if (isSuccessUpdateBoard) {
      enqueueSnackbar(langRef.current('Boards.successUpdateBoardTitle'), {
        ...messageSuccessOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [isSuccessUpdateBoard, closeSnackbar, enqueueSnackbar, langRef]);

  // show delete board error message
  useEffect(() => {
    if (errorDeletingBoard) {
      const errorMessage = langRef.current('Boards.errorDeletingBoard', {
        ERROR_MESSAGE: (errorDeletingBoard as IError).data.message || '',
      });
      enqueueSnackbar(errorMessage, {
        ...messageErrorOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [errorDeletingBoard, closeSnackbar, enqueueSnackbar, langRef]);

  // show delete board success message
  useEffect(() => {
    if (isSuccessDeletingBoard) {
      enqueueSnackbar(langRef.current('Boards.successDeletingBoard'), {
        ...messageSuccessOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [isSuccessDeletingBoard, closeSnackbar, enqueueSnackbar, langRef]);

  const updateBoardTitle: SubmitHandler<IBoardCreateObj> = (data) => {
    updateBoard({ body: data, id });
    setShowUpdateModal(false);
  };

  const removeHandler = async () => {
    deleteBoard({ id, title, description });
    setIsShowConfirmModalDelete(false);
  };

  const isChangeStateCard = isUpdateBoard || isDeleteBoard;
  return (
    <>
      <Grid item component="li" className={css.boardsList__item} key={id}>
        <CardContent className={css.boardsList__item_content}>
          <CardMedia
            className={css.boardsList__item_img}
            component="img"
            image={arrImages[indexImg]}
            alt={t('Boards.boardsHeadItemImgAlt', { ITEM_NAME: title })}
          />

          <Typography
            className={css.boardsList__item_title}
            gutterBottom
            variant="inherit"
            component="h3"
          >
            {title}
          </Typography>

          <Typography
            className={css.boardsList__item_description}
            gutterBottom
            variant="inherit"
            component="p"
          >
            {description}
          </Typography>
        </CardContent>

        <>{isChangeStateCard && <Spinner className={css.boardsList__item_spinner} size={20} />}</>

        <CardActions className={css.boardsList__item_actionsWrapper}>
          <Link
            className={classNames(css.boardsList__item_link, {
              [css.disabled]: isChangeStateCard,
            })}
            to={`${ROUTES_PATHS.boards}/${id}`}
            state={title}
            aria-disabled={isChangeStateCard}
          >
            {t('Boards.boardsLinkItemText')}
          </Link>

          <Stack direction="row">
            <IconButton
              className={css.boardsList__item_button}
              size="small"
              color="inherit"
              aria-label={t('Boards.editBoardTitleLabel')}
              onClick={() => setShowUpdateModal(true)}
              disabled={isChangeStateCard}
            >
              <HistoryEduIcon color="inherit" />
            </IconButton>

            <IconButton
              className={css.boardsList__item_button}
              size="small"
              color="inherit"
              onClick={() => setIsShowConfirmModalDelete(true)}
              aria-label={t('Boards.deleteBoardLabel')}
              disabled={isChangeStateCard}
            >
              <DeleteOutlineIcon color="inherit" />
            </IconButton>
          </Stack>
        </CardActions>
      </Grid>

      <ConfirmWindow
        isShow={isShowConfirmModalDelete}
        title={t('Boards.confirmDeleteBoardModalTitle')}
        disAgreeHandler={() => setIsShowConfirmModalDelete(false)}
        agreeHandler={removeHandler}
      />

      <LightboxBoard
        showModal={showUpdateModal}
        isLoading={isUpdateBoard}
        isUpdate={true}
        closeModalHandler={() => setShowUpdateModal(false)}
        submitCB={updateBoardTitle}
        modalTitle={t('Boards.updateModalTitle')}
        submitButtonText={t('Boards.updateModalSubmitButton')}
        formState={{ title, description }}
      />
    </>
  );
};

export default React.memo(BoardsListItem);
