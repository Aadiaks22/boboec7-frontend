import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import IdleTimer from './idletimer';

export default function ProtectedRoute() {
  const isAuthenticated = !!Cookies.get('token');

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

