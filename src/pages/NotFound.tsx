// src/pages/NotFound.tsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 text-primary hover:underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
