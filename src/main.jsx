import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homepage from './components/Homepage'
import ContextProvider from './context/Context'

// import

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ContextProvider>
        
        <Homepage />
      </ContextProvider>
  </StrictMode>,
)