import React from 'react';
import ReactDOM from 'react-dom';
import '@opentok/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import './index.css';
import './polyfills';
import {
  BrowserRouter as Router
} from "react-router-dom";


ReactDOM.render(
  <Router><App /></Router>,
  document.getElementById('root')
);