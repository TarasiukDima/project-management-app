import React, { FC } from 'react';
import { SnackbarProvider } from 'notistack';
import { CssBaseline } from '@mui/material';
import MuiTheme from '$components/MuiTheme';
import AppRoutes from '$components/AppRoutes';
import Header from '$components/Header';
import Main from '$components/Main';
import Footer from '$components/Footer';
import ErrorBoundary from '$components/ErrorBoundary';
import './App.scss';

const App: FC = () => {
  return (
    <MuiTheme>
      <React.Fragment>
        <SnackbarProvider maxSnack={5}>
          <CssBaseline />
          <ErrorBoundary>
            <Header />
            <Main>
              <AppRoutes />
            </Main>
            <Footer />
          </ErrorBoundary>
        </SnackbarProvider>
      </React.Fragment>
    </MuiTheme>
  );
};

export default App;
