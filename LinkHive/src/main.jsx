import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';

// Import the AuthProvider
import { AuthProvider } from './contexts/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
