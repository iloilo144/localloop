import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { BrowserRouter } from 'react-router-dom'
import { LoopProvider } from './context/LoopContext'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LoopProvider>
        <App />
      </LoopProvider>
    </BrowserRouter>
  </StrictMode>,
)
