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