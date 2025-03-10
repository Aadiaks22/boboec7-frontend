import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import IdleTimer from "./idletimer";

export default function ProtectedRoute() {
  const token = Cookies.get("token");
  
  if (!token) return <Navigate to="/" replace />;
  return (
    <>
      <IdleTimer timeout={15 * 60 * 1000} />
      <Outlet />
    </>
  );
}

