import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
