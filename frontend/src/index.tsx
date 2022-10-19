// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';

// import {
//   BrowserRouter,
//   Routes,
//   Route
// } from "react-router-dom";

import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from "react-redux";
import store from './store'

import './index.css';
import App from './components/App';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
