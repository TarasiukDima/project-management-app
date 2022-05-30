import React, { FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useAppDispatch, useAppSelector } from '$store/store';
import { setToken } from '$store/appSlice';
import { useDeleteUserMutation, useGetUserInfoQuery } from '$services/api';
import { useDidMount } from 'beautiful-react-hooks';
import jwt_decode from 'jwt-decode';
import { Box, Button, ButtonGroup, Grid, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Section from '$components/Section';
import ProfileForm from './ProfileForm';
import ProfilePhotoLightbox from './ProfilePhotoLightbox';
import ConfirmWindow from '$components/ConfirmWindow';
import CloseButton from '$components/CloseButton';
import { importAllFiles } from '$utils/index';
import { ROUTES_PATHS } from '$settings/routing';
import {
  messageErrorOptions,
  messageSuccessOptions,
  TOKEN_AUTH_LOCALSTORAGE,
  AVATAR_INDEX_LOCALSTORAGE,
} from '$settings/index';
import { IError } from '$types/common';
import css from './Profile.module.scss';
import Spinner from '$components/Spinner';

const avatarsArray = importAllFiles(require.context('$assets/images/avatars', false, /\.png$/));

interface ITokenDecodeObj {
  userId: string;
  login?: string;
  iat?: number;
}

const Profile: FC = () => {
  const { t } = useTranslation();
  const langRef = useRef(t);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [indexAvatarPhoto, setIndexAvatarPhoto] = useState<number>(0);
  const [isShowModalUpdatePhoto, setIsShowModalUpdatePhoto] = useState<boolean>(false);
  const [isShowConfirmModalDelete, setIsShowConfirmModalDelete] = useState<boolean>(false);
  const { token } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const tokenDecoded: ITokenDecodeObj = jwt_decode(token || '');
  const {
    data: userInfo,
    isLoading: isLoadingUserInfo,
    error: errorUserInfo,
  } = useGetUserInfoQuery(tokenDecoded?.userId || '');
  const [
    deleteUser,
    { isLoading: isLoadingDelete, error: errorDeleteProfile, isSuccess: isSuccessDeleteUser },
  ] = useDeleteUserMutation();

  useDidMount(() => {
    const indexPhoto = Math.round(Number(localStorage.getItem(AVATAR_INDEX_LOCALSTORAGE))) || 0;

    if (indexPhoto > 0 && indexPhoto < avatarsArray.length) {
      setIndexAvatarPhoto(indexPhoto);
    }
  });

  useEffect(() => {
    if (errorUserInfo) {
      enqueueSnackbar(langRef.current('Profile.errorGetUserInfo'), {
        ...messageErrorOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
      navigate(ROUTES_PATHS.welcome, { replace: true });
    }
  }, [errorUserInfo, langRef, enqueueSnackbar, closeSnackbar, navigate]);

  useEffect(() => {
    if (errorDeleteProfile) {
      const errorMessage = langRef.current('Profile.errorDeleteProfile', {
        ERROR_MESSAGE: (errorDeleteProfile as IError).data.message || '',
      });
      enqueueSnackbar(errorMessage, {
        ...messageErrorOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
    }
  }, [errorDeleteProfile, langRef, enqueueSnackbar, closeSnackbar]);

  useEffect(() => {
    if (isSuccessDeleteUser) {
      enqueueSnackbar(langRef.current('Profile.successDeleteUser'), {
        ...messageSuccessOptions,
        action: (key) => <CloseButton closeCb={() => closeSnackbar(key)} />,
      });
      dispatch(setToken(null));
      localStorage.removeItem(TOKEN_AUTH_LOCALSTORAGE);
      navigate(ROUTES_PATHS.welcome, { replace: true });
    }
  }, [isSuccessDeleteUser, langRef, enqueueSnackbar, closeSnackbar, dispatch, navigate]);

  const changeIndexPhoto = (index: number) => {
    setIndexAvatarPhoto(index);
  };

  const removeHandler = async () => {
    if (userInfo) {
      deleteUser(userInfo.id);
    }
    setIsShowConfirmModalDelete(false);
  };

  return (
    <>
      <Section pageAllSpace={true} className={css.profile}>
        {isLoadingUserInfo || isLoadingDelete ? (
          <Spinner className={css.profile__loader} />
        ) : (
          <>
            <Typography variant="inherit" component="h2" className={css.profile__title} mb={5}>
              {t('Profile.pageTitle', { NAME: userInfo?.login || '' })}
            </Typography>

            <Grid
              container
              className={css.profile__content}
              justifyContent="center"
              alignItems="flex-start"
            >
              <Grid item className={css.profile__content_user}>
                <Box
                  className={css.profile__content_img}
                  component="img"
                  alt={t('Profile.userImage')}
                  src={avatarsArray[indexAvatarPhoto]}
                />

                <ButtonGroup className={css.profile__content_buttons}>
                  <Button
                    className={css.profile__content_buttonDelete}
                    onClick={() => setIsShowConfirmModalDelete(true)}
                  >
                    {t('Profile.deleteButtonText')}
                    <DeleteForeverIcon />
                  </Button>

                  <Button
                    className={css.profile__content_buttonChange}
                    onClick={() => setIsShowModalUpdatePhoto(true)}
                  >
                    {t('Profile.showAvatarUpdateModalButton')}
                  </Button>
                </ButtonGroup>
              </Grid>

              <ProfileForm userId={userInfo?.id || ''} />
            </Grid>

            <ConfirmWindow
              isShow={isShowConfirmModalDelete}
              title={t('Profile.confirmDeleteModalTitle')}
              disAgreeHandler={() => setIsShowConfirmModalDelete(false)}
              agreeHandler={removeHandler}
            />
          </>
        )}
      </Section>

      <ProfilePhotoLightbox
        showModal={isShowModalUpdatePhoto}
        avatarsArray={avatarsArray}
        currentPhotoIndex={indexAvatarPhoto}
        changeIndexPhoto={changeIndexPhoto}
        closeModalHandler={() => setIsShowModalUpdatePhoto(false)}
        modalTitle={t('Profile.avatarUpdateModalTitle')}
      />
    </>
  );
};

export default Profile;
