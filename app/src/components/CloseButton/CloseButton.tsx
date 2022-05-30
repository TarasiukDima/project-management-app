import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { TSimpleFunction } from '$types/common';

interface ICloseButtonProps {
  size?: 'small' | 'large' | 'medium';
  className?: string;
  closeCb: TSimpleFunction;
}
const CloseButton: FC<ICloseButtonProps> = ({ closeCb, size = 'small', className }) => {
  const { t } = useTranslation();
  return (
    <IconButton
      size={size}
      aria-label={t('General.ariaLabelCloseButton')}
      onClick={closeCb}
      className={className}
      color="inherit"
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
};

export default CloseButton;
