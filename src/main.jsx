import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Auth0Provider } from "@auth0/auth0-react";

import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
    domain="dev-4lsg0tklophbizi8.us.auth0.com"
    clientId="X9ratuaJZY3NQWrbVIZ1CJZuALEZfJCt"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}>

    <App />
    </Auth0Provider>
  </StrictMode>,
)
