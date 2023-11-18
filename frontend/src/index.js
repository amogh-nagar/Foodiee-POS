import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import appStore from './store/store';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={appStore}>
    <BrowserRouter>
      <Layout/>
    </BrowserRouter>
  </Provider>
);

