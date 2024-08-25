import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
interface ProtectedRouteProps {
    element: ReactElement;
  }

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!token || !username) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;