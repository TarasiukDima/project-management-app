import React, { FC } from 'react';
import Spinner from '$components/Spinner';
import { IWrapEl } from '$types/common';

const AppSuspensePage: FC<IWrapEl> = ({ children }) => {
  return <React.Suspense fallback={<Spinner size={150} mt={3} />}>{children}</React.Suspense>;
};

export default AppSuspensePage;
