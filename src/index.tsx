import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './Styles/imports/reset.css';
import './Styles/imports/fontawesome.css';
import './Styles/main.css';
import { BrowserRouter } from 'react-router-dom';

document.addEventListener('contextmenu', e => {
  e.preventDefault();
  return false;
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> 
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
