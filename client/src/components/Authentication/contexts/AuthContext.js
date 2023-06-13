// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   async function checkAuth() {
//     try {
//       const res = await axios.get("http://localhost:5000/users/check-auth", {
//         withCredentials: true,
//       });
//       if (res.status === 200) {
//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       setIsAuthenticated(false);
//     }
//   }

//   return (
//     <AuthContext.Provider value={{ isAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
