// import { createContext, useContext, useState, useEffect } from "react";
// import { login as loginApi, register as registerApi, logout as logoutApi, getUser as getUserApi } from "@/api/auth";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // تحميل بيانات المستخدم عند بدء التطبيق
//   useEffect(() => {
//     const initUser = async () => {
//       try {
//         const response = await getUserApi();
//         setUser(response?.user || null); // ✅ مباشرة
//       } catch (error) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     initUser();
//   }, []);

//   // تسجيل الدخول
//   const login = async (data) => {
//     const response = await loginApi(data);
//     setUser(response?.user || null); // ✅ مباشرة
//     return response;
//   };

//   // تسجيل مستخدم جديد
//   const register = async (data) => {
//     const response = await registerApi(data);
//     setUser(response?.user || null); // ✅ مباشرة
//     return response;
//   };

//   // تسجيل الخروج
//   const logout = async () => {
//     await logoutApi();
//     setUser(null);
//   };

//   // التحقق من الصلاحية
//   const hasPermission = (permissionName) => {
//     if (!user) return false;
//     return user.permissions?.includes(permissionName);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout, hasPermission }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
