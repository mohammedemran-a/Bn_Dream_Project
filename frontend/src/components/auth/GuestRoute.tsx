import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const GuestRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestRoute;
