import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import { BookingAuthProvider } from './context/BookingAuthContext';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <WishlistProvider>
          <BookingAuthProvider>
            <RouterProvider router={router} />
          </BookingAuthProvider>
        </WishlistProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
