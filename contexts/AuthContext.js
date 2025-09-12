import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_CUSTOMER } from '../graphql/queries/customer';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for auth token on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
    if (token) {
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user data if authenticated
  const { data: customerData, loading: customerLoading } = useQuery(GET_CUSTOMER, {
    skip: !isAuthenticated,
    onCompleted: (data) => {
      if (data?.customer) {
        setUser(data.customer);
        setLoading(false);
      }
    },
    onError: () => {
      // If query fails, user might not be authenticated
      logout();
    }
  });

  const login = (authToken, userData) => {
    localStorage.setItem("auth-token", authToken);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("woo-session");
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading: loading || customerLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
