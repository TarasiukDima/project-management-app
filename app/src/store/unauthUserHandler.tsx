import { FC } from 'react';
import { MiddlewareAPI, isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { Navigate } from 'react-router-dom';
import { useDidMount } from 'beautiful-react-hooks';
import { TOKEN_AUTH_LOCALSTORAGE } from '$settings/index';
import { ROUTES_PATHS } from '$settings/routing';
import { setToken } from './appSlice';

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const { statusCode } = action.payload.data;
    if (statusCode === 401) {
      localStorage.removeItem(TOKEN_AUTH_LOCALSTORAGE);
      api.dispatch(setToken(null));
      return <NavigateToWelcome />;
    }
  }

  return next(action);
};

const NavigateToWelcome: FC = () => {
  useDidMount(() => {
    <Navigate to={ROUTES_PATHS.welcome} />;
  });
  return null;
};
