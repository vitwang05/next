// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CUSTOMER } from "@/graphql/queries/customer";
import { LOGIN_CUSTOMER } from "../graphql/mutations/customer";
import type { LoginResponse, LoginVariables } from "../types/auth";
import type { GetCustomerResponse, Customer } from "@/types/customers";

type AuthContextType = {
  isAuthenticated: boolean;
  user: Customer | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
    if (token) setIsAuthenticated(true);
    setLoading(false);
  }, []);

  // <-- quan trọng: truyền generic GetCustomerResponse
  const { data, loading: customerLoading, error } = useQuery<GetCustomerResponse>(GET_CUSTOMER, {
    skip: !isAuthenticated,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    // bây giờ TypeScript biết data?.customer có kiểu Customer | null
    if (data?.customer) {
      setUser(data.customer);
    } else if (!customerLoading && isAuthenticated) {
      // nếu đã auth mà server trả null => logout
      logout();
    }
  }, [data, customerLoading, isAuthenticated]);

  useEffect(() => {
    if (error) {
      console.error("Auth error:", error.message);
      // tuỳ luồng: chỉ logout nếu lỗi xác thực, ở đây đơn giản gọi logout
      logout();
    }
  }, [error]);
  const [loginMutation, { loading: loginLoading }] = useMutation<LoginResponse, LoginVariables>(LOGIN_CUSTOMER);

  const login = async (username: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { input: { username, password } },
      });

      if (data?.login) {
        localStorage.setItem("auth-token", data.login.authToken);
        setIsAuthenticated(true);

        // tạm set user (loại bỏ lỗi TS)
        setUser({
          ...data.login.user,
          databaseId: Number(data.login.user.id),
          displayName: data.login.user.firstName || data.login.user.username,
          billing: null,
          shipping: null,
        } as Customer);
      }
    } catch (err: any) {
      console.error("Login error:", err.message);
      throw err;
    }
};


  const logout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("woo-session");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading: loading || customerLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
