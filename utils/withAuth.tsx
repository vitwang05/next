import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { ComponentType } from "react";

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const ProtectedComponent = (props: P) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace("/login");
      }
    }, [loading, isAuthenticated, router]);

    if (loading) return <p>Loading...</p>;
    if (!isAuthenticated) return null; // chưa login thì đợi redirect

    return <WrappedComponent {...props} />;
  };

  // giữ nguyên displayName để dễ debug
  ProtectedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ProtectedComponent;
}
