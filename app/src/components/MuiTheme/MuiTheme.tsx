import React, { FC, Ref } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { LinkProps } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const MuiTheme: FC<{ children: React.ReactNode }> = (props) => {
  const LinkBehavior = React.forwardRef((props, ref) => {
    const { href, ...other } = props as Omit<RouterLinkProps, 'to'> & {
      href: RouterLinkProps['to'];
    };
    return <RouterLink ref={ref as Ref<HTMLAnchorElement> | undefined} to={href} {...other} />;
  });

  const theme = createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehavior,
        } as Partial<LinkProps<'a', Record<string, unknown>>>,
      },
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehavior,
        },
      },
    },
    typography: {
      fontFamily: "'Gilroy', sans-serif",
    },
  });
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};
export default MuiTheme;
