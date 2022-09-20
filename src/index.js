import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { GithubProvider } from './context/context';
import { Auth0Provider } from '@auth0/auth0-react';
// domain
// dev-nux-kgy9.us.auth0.com
// client id
// 8VFSvgJubEmapmvMPHYqm4Xm6HMbLBr6
ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-nux-kgy9.us.auth0.com"
      clientId="gXF0RmnB10BRYFjg29m1w8zS8SeNGSw8"
      clientSecret="ZCrZsMxIGpGjJilIQ4kDrTelYUQtJ0h7WaaiCU3FTtBh93T-7VYck58ajQ9rCPpX"
      redirectUri={window.location.origin}>
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
  </React.StrictMode>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
