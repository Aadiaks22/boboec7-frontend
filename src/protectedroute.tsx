import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import IdleTimer from "./idletimer";
import { useMutation } from "@tanstack/react-query";
import { verifyToken } from "./http/api";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState<boolean | null>(null); // Track token validity

  // Use mutation for verifying token
  const mutation = useMutation({
    mutationFn: async (token: string | undefined) => {
      if (!token) throw new Error("No token provided"); // Prevent empty token checks
      return await verifyToken(token); // API call
    },
    onSuccess: (data) => {
      if (data && data.valid) {
        setIsValid(true); // Token is valid
      } else {
        throw new Error("Invalid token"); // Ensure error is thrown for invalid tokens
      }
    },
    onError: () => {
      setIsValid(false); //Token is invalid
      Cookies.remove("token"); //Remove invalid token from cookies
      navigate("/", { replace: true });
    },
  });

  useEffect(() => {
    if (token) {
      mutation.mutate(token);
    } else {
      setIsValid(false); //Ensure immediate redirection if no token is found
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (isValid === false) {
    return <Navigate to="/" replace />;
  }

  if (isValid === null) {
    return <div>Loading...</div>; //Show loading state while verifying token
  }

  return (
    <>
      <IdleTimer timeout={15 * 60 * 1000} />
      <Outlet />
    </>
  );
}
