import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App'; 
import Header from 'components/Headaer';
import "./style.css";
ReactDOM.render(
  <React.StrictMode>
    <Header />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);