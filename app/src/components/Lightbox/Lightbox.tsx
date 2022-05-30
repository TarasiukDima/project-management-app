import React, { FC } from 'react';
import classNames from 'classnames';
import { Box, Modal, Typography } from '@mui/material';
import CloseButton from '$components/CloseButton';
import { IWrapEl, TSimpleFunction } from '$types/common';
import css from './LightBox.module.scss';

/*
 ** Принимает 5 аргумента:
 ** 1 - modalTitle - заголовок модального окна
 ** 2 - showModal открыто или закрыто модальное окно
 ** 3 - children внутренний контент модального окна
 ** 4 - closeModalFunction1 функция закрывающая модальное окно
 ** 5 - classNameContentWrapper класс для wrappera
 */

interface ILightBoxProps extends IWrapEl {
  modalTitle: string;
  showModal: boolean;
  closeModalFunction: TSimpleFunction;
  classNameContentWrapper?: string;
}
const LightBox: FC<ILightBoxProps> = ({
  modalTitle,
  showModal,
  children,
  closeModalFunction,
  classNameContentWrapper,
}) => {
  return (
    <Modal
      open={showModal}
      className={css.lightBox}
      onClose={closeModalFunction}
      aria-labelledby={modalTitle}
    >
      <Box
        className={classNames(css.lightBox__wrapper, {
          [classNameContentWrapper as string]: !!classNameContentWrapper,
        })}
      >
        <CloseButton closeCb={closeModalFunction} className={css.lightBox__wrapper_closeButton} />

        {modalTitle ? (
          <Typography
            id={modalTitle}
            variant="inherit"
            component="p"
            className={css.lightBox__wrapper_title}
            mb={3}
          >
            {modalTitle}
          </Typography>
        ) : null}

        {children}
      </Box>
    </Modal>
  );
};

export default LightBox;
