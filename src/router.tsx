import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

const router =  createBrowserRouter([
    {
        path: "*", // Catch-all route for undefined pages
        element: <NotFound />, // Show NotFound component for undefined routes
    },
    {
        path: '/',
        element: <HomePage />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <RegisterPage />
    }


])

export default router;