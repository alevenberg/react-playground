import React from 'react';
import ReactDOM from 'react-dom/client';
import App4 from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App4 cat={5} txt="this is the prop test" />
  </React.StrictMode>
);
