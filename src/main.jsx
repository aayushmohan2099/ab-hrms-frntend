import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Themes
import './theme/buttons/login.css';
import './theme/new_badge.css';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
