import React, { FC } from 'react';
import classNames from 'classnames';
import { Box, CircularProgress } from '@mui/material';
import css from './Spinner.module.scss';

interface ISpinnerProps {
  className?: string;
  size?: number;
  mt?: number;
}
const Spinner: FC<ISpinnerProps> = ({ className, size = 120, mt }) => {
  return (
    <Box
      className={classNames(css.spinner, {
        [className as string]: className,
      })}
      mt={mt}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default Spinner;
