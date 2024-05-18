import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import API_ENDPOINTS from "@/route/api";
import routes from "@/route/routes";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("authUser");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  useEffect(() => {
    // Add interceptor on component mount
    const interceptor = axios.interceptors.request.use(
        config => {
          const storedUser = localStorage.getItem("authUser");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            config.headers.Authorization = `Bearer ${user.jwt}`;
          }
          return config;
        },
        error => {
          return Promise.reject(error);
        }
    );

    // Remove interceptor on component unmount
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []); // Empty dependency array ensures this effect only runs once on component mount

  const login = (jwt, cookie) => {
    const newUser = { jwt, cookie };
    if (typeof window !== "undefined") {
      localStorage.setItem("authUser", JSON.stringify(newUser));
      setUser(newUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    }
  };

  const checkUser = () => {
    return user && user.jwt != null && user.cookie != null;
  };

  const logout = () => {
    doSignOut();
  };

  async function doSignOut() {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.merchantAuthLogout, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      });
      console.log(response);
      localStorage.removeItem("authUser");
      setUser(null);
      document.cookie = null;
      delete axios.defaults.headers.common['Authorization'];
      await router.push(routes.login);
    } catch (error) {
      console.error("Logout error: ", error);
    }
  }

  return (
      <AuthContext.Provider value={{ user, login, logout, checkUser }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
