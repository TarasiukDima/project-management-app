import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import Section from '$components/Section';
import { ROUTES_PATHS } from '$settings/routing';
import css from './ErrorPage.module.scss';

interface ILocationState {
  errorText: string;
}

const ErrorPage: FC = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const { errorText } = state as ILocationState;

  return (
    <Section className={css.errorPage} pageAllSpace={true}>
      <Typography className={css.errorPage__title} component="h2" variant="inherit" mb={5}>
        {t('ErrorPage.pageTitle')}
      </Typography>

      <Typography className={css.errorPage__text} component="p" variant="inherit">
        {errorText}
      </Typography>

      <Link to={ROUTES_PATHS.welcome} className={css.errorPage_link}>
        {t('NotFoundPage.backMainLink')}
      </Link>
    </Section>
  );
};

export default ErrorPage;
