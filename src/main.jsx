import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './Service/UserContext'; // Adjust path if needed
import { SchoolProvider } from './Service/SchoolContext'; // Adjust path if needed
import { ActiveUsersProvider } from './components/Admin UI/Dashboard/ActiveUsersContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <SchoolProvider>
            <ActiveUsersProvider>
          <App />
          </ActiveUsersProvider>
        </SchoolProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);