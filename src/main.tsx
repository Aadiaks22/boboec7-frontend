import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router.tsx'
import Modal from 'react-modal';
import {GlobalProvider} from './types/GlobalContext.tsx'

// Set the app element for accessibility
Modal.setAppElement('#root');

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
    </GlobalProvider>
  </StrictMode>,
)
