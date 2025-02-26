import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/KidsDictation";
import RegisterPage from "@/pages/StudentRegistration";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/layouts/DashboardLayout";
import AuthLayout from "@/layouts/AuthLayout";
import FeeCollection from "@/pages/FeeCollection";
import RegisterStudent from "@/pages/RegisterStudents";
import FeeInvoice from "@/pages/FeeInvoice";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./protectedroute";

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout/>,
    children: [
      {
        index: true,  // This makes it the default route
        element: <LoginPage />
      }
    ]
  },
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
  }
]);

export default router;