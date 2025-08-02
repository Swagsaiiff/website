import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        setLocation('/login');
        return;
      }
      if (adminOnly && user.role !== 'admin') {
        setLocation('/');
        return;
      }
    }
  }, [user, loading, adminOnly, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gaming-dark">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gaming-primary"></div>
      </div>
    );
  }

  if (!user || (adminOnly && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gaming-dark">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gaming-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
