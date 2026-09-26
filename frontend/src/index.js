import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';
import Context from './Context/Context';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || window.location.origin;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context>
      <App />
    </Context>
  </React.StrictMode>
);

serviceWorkerRegistration.register();

