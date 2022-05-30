import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Box } from '@mui/material';
import { Copyright as CopyrightIcon } from '@mui/icons-material';
import RSSchoolSign from '$assets/svg/RSSchoolSign.svg';
import css from './Footer.module.scss';

const Footer: FC = () => {
  const { t } = useTranslation();

  return (
    <Box component="footer" className={css.footer}>
      <Grid container className={css.footerContainer}>
        <Grid
          item
          className={css.footerContainer__schoolLink}
          component="a"
          href="https://rs.school/"
          target="_blank"
        >
          <img src={RSSchoolSign} alt={t('Footer.RSSchoolLogo')} />
        </Grid>

        <Grid item className={css.footerContainer__authors} component="ul">
          <Box component="li" className={css.footerContainer__authors_item}>
            <Box
              component="a"
              className={css.footerContainer__authors_link}
              href="https://github.com/TarasiukDima"
              target="_blank"
            >
              TarasiukDima
            </Box>
          </Box>

          <Box component="li" className={css.footerContainer__authors_item}>
            <Box
              component="a"
              className={css.footerContainer__authors_link}
              href="https://github.com/exekuta"
              target="_blank"
            >
              exekuta
            </Box>
          </Box>

          <Box component="li" className={css.footerContainer__authors_item}>
            <Box
              component="a"
              className={css.footerContainer__authors_link}
              href="https://github.com/darya-startsava"
              target="_blank"
            >
              darya-startsava
            </Box>
          </Box>
        </Grid>

        <Grid item className={css.footerContainer__copyright} component="p" alignItems="center">
          <CopyrightIcon color="inherit" />
          <Box component="span">2022. React 2022Q1</Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
