import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import './satoshi.css';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { RoleProvider } from './context/RoleContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <RoleProvider>
          <App />
        </RoleProvider>
      </Router>
    </Provider>
  </React.StrictMode>,
);