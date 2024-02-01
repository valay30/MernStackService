import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState("");
    const authorizationToken =  `Bearer ${token}`;


    const storeTokenInLS = (serverToken) => {
      setToken(serverToken);
      return localStorage.setItem("token", serverToken);
  };

  let isLoggedIn = !!token;
  console.log("token", token);
  console.log("isLoggesIn ",isLoggedIn);

  // tackling the logout functionality
  const LogoutUser = () => {
    setToken("");
    return localStorage.removeItem("token");
  };

  //JWT AUTHENTICATION - to get the currently loggedIN user data

  const userAuthentication = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("user data", data.userData);

        // our main goal is to get the user data 👇
        setUser(data.userData);
        setIsLoading(false);
      } else {
        console.error("Error fetching user data");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getServices = async () => {
    try {
    const response = await fetch("http://localhost:5000/api/data/service", {
    method: "GET",
    });
    if (response.ok) {
    const services = await response.json();
    setServices(services.data);
    }
    console.log("service ", response);
    } catch (error) {
    console.log(error);
    }
  };
    


  useEffect(() => {
    getServices();
    userAuthentication();
  }, []);



  return (
    <AuthContext.Provider 
    value={{
      isLoggedIn, 
      storeTokenInLS, 
      LogoutUser, 
      user, 
      services,
      authorizationToken, 
      isLoading,
     }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
      throw new Error("useAuth used outside of the Provider");
    }
    return authContextValue;
  };