import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import Section from '$components/Section';
import { ROUTES_PATHS } from '$settings/routing';
import css from './NotFoundPage.module.scss';

const NotFoundPage: FC = () => {
  const { t } = useTranslation();
  return (
    <Section className={css.error_page} pageAllSpace={true}>
      <Typography className={css.error_status} variant="inherit" component="p">
        404
      </Typography>

      <Typography className={css.error_heading} variant="inherit" component="h2" mb={5}>
        {t('NotFoundPage.heading')}
      </Typography>

      <Typography className={css.error_text} variant="inherit" component="p">
        {t('NotFoundPage.text')}
      </Typography>

      <Typography className={css.error_text} variant="inherit" component="p">
        {t('NotFoundPage.checkUrlText')}
      </Typography>

      <Link to={ROUTES_PATHS.welcome} className={css.error_link}>
        {t('NotFoundPage.backMainLink')}
      </Link>
    </Section>
  );
};

export default NotFoundPage;
