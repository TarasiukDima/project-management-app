import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { TSimpleFunction } from '$types/common';
import css from './ConfirmWindow.module.scss';

interface IConfirmWindowProps {
  isShow: boolean;
  title: string;
  disAgreeHandler: TSimpleFunction;
  agreeHandler: TSimpleFunction;
}
const ConfirmWindow: FC<IConfirmWindowProps> = ({
  isShow,
  title,
  disAgreeHandler,
  agreeHandler,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={isShow}
      onClose={disAgreeHandler}
      aria-labelledby="alert-dialog-title"
      className={css.profile__confirmModal}
    >
      <DialogTitle id="alert-dialog-title" className={css.profile__confirmModal_title}>
        {title}
      </DialogTitle>

      <DialogActions className={css.profile__confirmModal_buttonsWrapper}>
        <Button onClick={disAgreeHandler} className={css.profile__confirmModal_red} autoFocus>
          {t('General.disagreeButtonText')}
        </Button>

        <Button onClick={agreeHandler} className={css.profile__confirmModal_green}>
          {t('General.agreeButtonText')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmWindow;
