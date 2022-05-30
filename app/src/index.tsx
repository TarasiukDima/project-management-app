import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import App from '$components/App';

import { store } from '$store/store';
import './i18n';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);
