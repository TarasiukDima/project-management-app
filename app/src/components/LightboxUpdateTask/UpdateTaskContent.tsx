import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography } from '@mui/material';
import { TSimpleFunction } from '$types/common';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import css from './LightboxUpdateTask.module.scss';

interface IUpdateTaskContentProps {
  description: string;
  responsibleUser: string;
  showForm: TSimpleFunction;
}

const UpdateTaskContent: FC<IUpdateTaskContentProps> = ({
  description,
  responsibleUser,
  showForm,
}) => {
  const { t } = useTranslation();

  return (
    <Box className={css.taskContent}>
      <Typography className={css.taskContent__description} component="p" variant="inherit">
        {description}
      </Typography>

      <Typography className={css.taskContent__people} component="p" variant="inherit">
        <AccountCircleIcon className={css.taskContent__avatar} color="inherit" />
        <Box component="span">{responsibleUser}</Box>
      </Typography>

      <Button className={css.taskContent__button} onClick={showForm}>
        {t('Tasks.updateTaskLabel')}
      </Button>
    </Box>
  );
};

export default UpdateTaskContent;
