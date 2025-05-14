/* eslint-disable react/prop-types */
import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";

const userContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const baseURL = import.meta.env.VITE_EMPORA_LINK;
      if (!baseURL) {
        throw new Error("Environment variable VITE_EMPORA_LINK is not set.");
      }
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            `${baseURL}/api/auth/verify`,
            {
              headers: { 
                "Authorization": `Bearer ${token}`,
              },
            }
          );
          if (response.data.success) {
            setUser(response.data.user);
          }
        } else {
            setUser(null)
            setLoading(false)
        }
      } catch (error) {
        if (error.response && !error.response.data.error) {
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    };
    verifyUser();
  }, []);

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };
  return (
    <userContext.Provider value={{ user, login, logout , loading }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);
export default AuthContext;
