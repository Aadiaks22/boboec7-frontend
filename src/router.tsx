import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import RegisterPage from "@/pages/RegisterPage";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/layouts/DashboardLayout";

const router =  createBrowserRouter([
    {
        path: "*", // Catch-all route for undefined pages
        element: <NotFound />, // Show NotFound component for undefined routes
    },
    {
        path: 'dashboard',
        element: <DashboardLayout />,
        children:[
            {
                path: 'home',
                element: <HomePage />
            },
            {
                path: 'register',
                element: <RegisterPage />
            }
        ]

    },
    {
        path: '/login',
        element: <LoginPage />
    }


])

export default router;