import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Lightbox from '$components/Lightbox';
import { Box, Button } from '@mui/material';
import { AVATAR_INDEX_LOCALSTORAGE } from '$settings/index';
import { TSimpleFunction } from '$types/common';
import css from './Profile.module.scss';

interface IProfilePhotoLightboxProps {
  currentPhotoIndex: number;
  avatarsArray: Array<string>;
  changeIndexPhoto: (index: number) => void;
  showModal: boolean;
  closeModalHandler: TSimpleFunction;
  modalTitle: string;
}

const ProfilePhotoLightbox: FC<IProfilePhotoLightboxProps> = ({
  currentPhotoIndex,
  avatarsArray,
  changeIndexPhoto,
  showModal,
  closeModalHandler,
  modalTitle,
}) => {
  const { t } = useTranslation();
  const [photoChoiceIndex, setPhotoChoiceIndex] = useState<number>(0);

  useEffect(() => {
    setPhotoChoiceIndex(currentPhotoIndex);
  }, [currentPhotoIndex]);

  const updatePhoto: TSimpleFunction = (): void => {
    if (photoChoiceIndex !== currentPhotoIndex) {
      changeIndexPhoto(photoChoiceIndex);
      localStorage.setItem(AVATAR_INDEX_LOCALSTORAGE, photoChoiceIndex.toString());
      closeModalHandler();
    }
  };

  return (
    <Lightbox
      showModal={showModal}
      closeModalFunction={closeModalHandler}
      modalTitle={modalTitle}
      classNameContentWrapper={css.avatarWrapper}
    >
      <Box component="ul" className={css.photosList}>
        {avatarsArray.map((photo, index) => (
          <Box key={index} component="li" className={css.photosList__item}>
            <Button
              onClick={() => setPhotoChoiceIndex(index)}
              className={classNames(css.photosList__item_button, {
                [css.active]: photoChoiceIndex === index,
                [css.chosen]: index === currentPhotoIndex,
              })}
            >
              <Box
                component="img"
                src={photo}
                alt={t('Profile.avatarUpdateModalImgAlt', { NUMBER_AVATAR: index })}
              />
            </Button>
          </Box>
        ))}
      </Box>

      <Button
        className={classNames(css.photosList__changeButton, {
          [css.disabled]: false,
        })}
        onClick={updatePhoto}
        disabled={photoChoiceIndex === currentPhotoIndex}
      >
        {t('Profile.avatarUpdateModalChangeButtonText')}
      </Button>
    </Lightbox>
  );
};

export default ProfilePhotoLightbox;
