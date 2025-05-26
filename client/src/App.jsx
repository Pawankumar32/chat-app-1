// Import necessary modules and components
import { Navigate, Route, Routes } from 'react-router-dom'; // For routing
import HomePage from './pages/HomePage'; // Home page component
import LoginPage from './pages/LoginPage'; // Login page component
import ProfilePage from './pages/ProfilePage'; // Profile page component
import { Toaster } from 'react-hot-toast'; // For toast notifications
import { useContext } from 'react'; // For accessing context
import { AuthContext } from '../context/AuthContext'; // Auth context to manage authentication state

const App = () => {
  // Destructure authUser from AuthContext to check authentication status
  const { authUser } = useContext(AuthContext);

  return (
    <div className="bg-[url('./assets/bgImage.svg')] bg-contain">
      {/* Toast notification container */}
      <Toaster />

      {/* Define application routes */}
      <Routes>
        {/* Route for the home page */}
        <Route 
          path="/" 
          element={authUser ? <HomePage /> : <Navigate to="/login" />} 
        />

        {/* Route for the login page */}
        <Route 
          path="login" 
          element={!authUser ? <LoginPage /> : <Navigate to="/" />} 
        />

        {/* Route for the profile page */}
        <Route 
          path="/profile" 
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
};

export default App;