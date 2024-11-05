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
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./protectedroute";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: 'dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '',
            element: <Dashboard />
          },
          {
            path: 'kids-dictation',
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
]);

export default router;