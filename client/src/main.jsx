<<<<<<< HEAD
// Import necessary modules
import { createRoot } from 'react-dom/client'; // ReactDOM for rendering the app
import './index.css'; // Global CSS styles
import App from './App.jsx'; // Main App component
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter for routing
import { AuthProvider } from '../context/AuthContext'; // AuthProvider for authentication state management
import { ChatProvider } from '../context/ChatContext.jsx'; // ChatProvider for chat-related state management

// Render the React application to the root DOM element
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* Provide authentication state globally */}
    <AuthProvider>
      {/* Provide chat state globally */}
      <ChatProvider>
        {/* Main App component */}
        <App />
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>
);
=======
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
// browser router from react router dom
import { AppContextProvider } from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />

    </AppContextProvider>
  </BrowserRouter>,
)
>>>>>>> 2a2e64e73ead8457fd9dd00ae2074bdcd60cc53a
