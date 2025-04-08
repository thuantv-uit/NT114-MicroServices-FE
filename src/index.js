import React from 'react';
import { createRoot } from 'react-dom/client'; // Sử dụng createRoot thay vì ReactDOM
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

const root = createRoot(document.getElementById('root')); // Tạo root mới
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);