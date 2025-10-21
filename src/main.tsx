import { StrictMode } from 'react';
import WebFont from 'webfontloader';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Load fonts before rendering the app
WebFont.load({
  google: {
    families: ['Poppins:300,400,500,600', 'Great Vibes']
  },
  active: () => {
    // Fonts are loaded, render the app
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  },
  inactive: () => {
    // Fallback: render even if fonts fail to load
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
});
