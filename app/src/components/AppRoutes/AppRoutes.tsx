import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Welcome from '$pages/Welcome';
import Boards from '$pages/Boards';
import OneBoard from '$pages/OneBoard';
import RequiredAuth from '$components/RequiredAuth';
import NoDoubleLogin from '$components/NoDoubleLogin';
import { ROUTES_PATHS } from '$settings/routing';
import AppSuspensePage from './AppSuspensePage';

const Profile = React.lazy(() => import('$pages/Profile'));
const Authorization = React.lazy(() => import('$pages/Authorization'));
const NotFoundPage = React.lazy(() => import('$pages/NotFoundPage'));
const ErrorPage = React.lazy(() => import('$pages/ErrorPage'));

const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path={ROUTES_PATHS.welcome} element={<Welcome />} />
      <Route
        path={ROUTES_PATHS.boards}
        element={
          <RequiredAuth redirect={ROUTES_PATHS.welcome}>
            <Boards />
          </RequiredAuth>
        }
      />
      <Route
        path={`${ROUTES_PATHS.boards}/:id`}
        element={
          <RequiredAuth redirect={ROUTES_PATHS.welcome}>
            <OneBoard />
          </RequiredAuth>
        }
      />
      <Route
        path={ROUTES_PATHS.login}
        element={
          <NoDoubleLogin redirect={ROUTES_PATHS.boards}>
            <AppSuspensePage>
              <Authorization key={'LogIn'} sortOfAuth={'LogIn'} />
            </AppSuspensePage>
          </NoDoubleLogin>
        }
      />
      <Route
        path={ROUTES_PATHS.registration}
        element={
          <NoDoubleLogin redirect={ROUTES_PATHS.boards}>
            <AppSuspensePage>
              <Authorization key={'Registration'} sortOfAuth={'Registration'} />
            </AppSuspensePage>
          </NoDoubleLogin>
        }
      />
      <Route
        path={ROUTES_PATHS.profile}
        element={
          <RequiredAuth redirect={ROUTES_PATHS.welcome}>
            <AppSuspensePage>
              <Profile />
            </AppSuspensePage>
          </RequiredAuth>
        }
      />
      <Route
        path={ROUTES_PATHS.error_page}
        element={
          <AppSuspensePage>
            <ErrorPage />
          </AppSuspensePage>
        }
      />
      <Route
        path={ROUTES_PATHS.not_found_page}
        element={
          <AppSuspensePage>
            <NotFoundPage />
          </AppSuspensePage>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
