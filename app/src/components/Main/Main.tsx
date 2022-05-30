import React, { FC } from 'react';
import { IWrapEl } from '$types/common';
import css from './Main.module.scss';

const Main: FC<IWrapEl> = ({ children }) => {
  return <main className={css.main}>{children}</main>;
};

export default Main;
