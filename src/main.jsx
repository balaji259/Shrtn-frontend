import React,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
import { ContextProvider } from './context/ContextApi.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>

    <ContextProvider>

    <App />
    
    <Toaster
     position="top-center"
    reverseOrder={false}
    />

    </ContextProvider>
  </QueryClientProvider>
  </StrictMode>,
)
