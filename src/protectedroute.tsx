import { Navigate, Outlet } from 'react-router-dom';
import IdleTimer from './idletimer';

export default function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <>
      <IdleTimer timeout={15 * 60 * 1000} /> {/* 15 minutes timeout */}
      <Outlet />
    </>
  );
}