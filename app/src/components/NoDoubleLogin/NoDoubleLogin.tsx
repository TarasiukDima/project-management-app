import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '$store/store';
import { ROUTES_PATHS } from '$settings/routing';

interface INoDoubleLoginProps {
  children: JSX.Element | null;
  redirect?: string;
}

const NoDoubleLogin: FC<INoDoubleLoginProps> = ({
  children,
  redirect = ROUTES_PATHS.boards,
}: INoDoubleLoginProps) => {
  const { token } = useAppSelector((state) => state.app);

  if (token) {
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default NoDoubleLogin;
