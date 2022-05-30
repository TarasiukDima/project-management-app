import React, { useState } from 'react';
import { Button, Typography, ListItem, List, CardMedia, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Lightbox from '$components/Lightbox';
import Section from '$components/Section';
import AnimatedLeftImg from './AnimatedLeftImg';
import AnimatedRightImg from './AnimatedRightImg';
import author1 from '$assets/images/Dmitrij.jpg';
import author2 from '$assets/images/Andrey.jpg';
import author3 from '$assets/images/Darya.jpeg';
import css from './Welcome.module.scss';

const Welcome = () => {
  const [showAuthors, setShowAuthors] = useState<boolean>(false);
  const { t } = useTranslation();
  const handleOpen = () => setShowAuthors(true);
  const handleClose = () => setShowAuthors(false);

  return (
    <>
      <Section pageAllSpace={true} className={css.welcomePage}>
        <AnimatedLeftImg />
        <AnimatedRightImg />

        <Typography className={css.welcomePage_title} mb={5}>
          {t('Welcome.titleText')}
        </Typography>

        <CardMedia
          className={css.welcomePage_youtube}
          id="iframeApp"
          component="iframe"
          src="https://www.youtube.com/embed/uhNKQcdveew"
          allow="accelerometer; autoplay; fullscreen; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={t('Welcome.video')}
        />

        <Typography className={css.welcomePage_text}>{t('Welcome.welcomeText')}</Typography>

        <Button
          className={css.welcomePage_button}
          onClick={handleOpen}
          aria-label={t('Welcome.btnAboutUsAriaLabel')}
        >
          {t('Welcome.aboutUs')}
        </Button>
      </Section>

      <Lightbox
        showModal={showAuthors}
        closeModalFunction={handleClose}
        modalTitle={t('Welcome.aboutUs')}
        classNameContentWrapper={css.modalWrapper}
      >
        <Typography className={css.developersDescription} align="center">
          {t('Welcome.modalText')}
        </Typography>

        <List className={css.developerList}>
          <ListItem className={css.developerList__item}>
            <Box
              className={css.developerList__item_photo}
              component="img"
              src={author1}
              alt={t('Welcome.author1')}
            />
            <Box
              component="a"
              className={css.developerList__item_name}
              href="https://github.com/TarasiukDima"
              target="_blank"
            >
              {t('Welcome.author1')}
            </Box>
            <Typography className={css.developers__item_roleTitle} align="center" display="block">
              {t('Welcome.roleTitle')}
            </Typography>
            <Typography className={css.developers__item_role} align="center">
              {t('Welcome.roleLead')}
            </Typography>
          </ListItem>

          <ListItem className={css.developerList__item}>
            <Box
              className={css.developerList__item_photo}
              component="img"
              src={author2}
              alt={t('Welcome.author2')}
            />
            <Box
              component="a"
              className={css.developerList__item_name}
              href="https://github.com/exekuta"
              target="_blank"
            >
              {t('Welcome.author2')}
            </Box>
            <Typography className={css.developers__item_roleTitle} align="center" display="block">
              {t('Welcome.roleTitle')}
            </Typography>
            <Typography className={css.developers__item_role} align="center">
              {t('Welcome.roleDev')}
            </Typography>
          </ListItem>

          <ListItem className={css.developerList__item}>
            <Box
              className={css.developerList__item_photo}
              component="img"
              src={author3}
              alt={t('Welcome.author3')}
            />
            <Box
              component="a"
              className={css.developerList__item_name}
              href="https://github.com/darya-startsava"
              target="_blank"
            >
              {t('Welcome.author3')}
            </Box>
            <Typography className={css.developers__item_roleTitle} align="center" display="block">
              {t('Welcome.roleTitle')}
            </Typography>
            <Typography className={css.developers__item_role} align="center">
              {t('Welcome.roleDev')}
            </Typography>
          </ListItem>
        </List>
      </Lightbox>
    </>
  );
};

export default Welcome;
