import React, { FC } from 'react';
import classNames from 'classnames';
import { Container, ContainerProps } from '@mui/material';
import css from './Section.module.scss';

// Принимает пропсы для контейнера из material ui и передает их в контейнер
interface ISectionProps extends ContainerProps {
  className?: string;
  pageAllSpace?: boolean;
}

const Section: FC<ISectionProps> = ({
  children,
  className,
  pageAllSpace = false,
  ...containerProps
}) => {
  const sectionClassName = classNames(className, {
    [css.page_all_space]: pageAllSpace,
  });

  return (
    <section className={sectionClassName}>
      <Container {...containerProps}>{children}</Container>
    </section>
  );
};

export default Section;
