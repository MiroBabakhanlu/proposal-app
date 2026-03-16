import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { SocketProvider } from './context/SocketContext';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

const NotFound = () => (
  <div className="text-center py-12">
    <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-gray-500">The page you are looking for does not exist.</p>
    <Link to='/dashboard'>Redirect Me</Link>
  </div>
);


function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;