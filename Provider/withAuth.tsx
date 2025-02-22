"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Import RootState from Redux store

const withAuth = (WrappedComponent: React.FC) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login"); // Redirect to login if not authenticated
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null; // Prevent rendering protected content while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
