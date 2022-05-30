import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '$store/store';
import { ROUTES_PATHS } from '$settings/routing';

interface IRequiredAuthProps {
  children: JSX.Element | null;
  redirect?: string;
}

const RequiredAuth: FC<IRequiredAuthProps> = ({
  children,
  redirect = ROUTES_PATHS.welcome,
}: IRequiredAuthProps) => {
  const { token } = useAppSelector((state) => state.app);

  if (!token) {
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default RequiredAuth;
