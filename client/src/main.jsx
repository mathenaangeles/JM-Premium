import { StrictMode } from 'react'
import { Provider  } from 'react-redux';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { PersistGate } from 'redux-persist/integration/react';

import '@fontsource/open-sans';
import '@fontsource/dm-serif-display'; 

import './index.css'
import App from './App.jsx'
import theme from './theme.js';
import { store, persistor } from './store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
)


import React from 'react';
