import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import RegisterPage from "@/pages/RegisterPage";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/layouts/DashboardLayout";
import AuthLayout from "@/layouts/AuthLayout";
import FeeCollection from "@/pages/FeeCollection";
import RegisterStudent from "@/pages/RegisteredStudent";
import FeeInvoice from "@/pages/FeeInvoice";

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
            },
            {
                path: 'fee-collection/:id',
                element: <FeeCollection />
            },
            {
                path: 'fee-collection',
                element: <FeeCollection />
            },
            {
                path: 'register-student',
                element: <RegisterStudent/>
            },
            {
                path: 'feeinvoice',
                element: <FeeInvoice/>
            }

        ]
    },
    {
        path: '/auth',
        element: <AuthLayout/>,
        children: [
            {
                path: 'login',
                element: <LoginPage />
            }
        ]
    }


])

export default router;