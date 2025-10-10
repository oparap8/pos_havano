import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { db } from './lib/frappeClient'

const defaultCurrency = await db.getSingleValue("System Settings", "currency");
console.log('defaultCurrency:', defaultCurrency); 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
