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
import Demo4 from "@/pages/Demo4";
import Demo from "./pages/Demo";
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
  },
  {
    path: '/demo4',
    element: <Demo4/>
  },
  {
    path: '/demo',
    element: <Demo/>
  }
]);

export default router;