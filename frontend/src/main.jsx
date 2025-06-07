import { StrictMode } from 'react'
/****** <StrictMode> is a tool for developers.
 * It helps you find potential problems in your React code during development.
 * It Detects unsafe lifecycle methods, Warns about usage of deprecated APIs.
 * Runs certain functions (like useEffect) twice on purpose to help identify side effects that aren’t idempotent.
******/

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
