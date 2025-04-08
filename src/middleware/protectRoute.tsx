'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hook';
import {
  logout,
  checkTokenExpiration,
  hydrate
} from '@/lib/redux/slices/authSlice';
import { isTokenExpired } from '@/lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login' // Changed to login as default redirect
}) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get all relevant auth state from Redux
  const {
    isAuthenticated,
    tokens,
    isTokenExpired: tokenExpired
  } = useAppSelector((state) => state.auth);

  // Handle authentication verification after state is loaded
  useEffect(() => {
    const verifyAuth = async () => {
      // If we have a token, check if it's valid
      if (tokens) {
        if (isTokenExpired(tokens.access_token)) {
          console.log('Token is expired, logging out');
          dispatch(logout());
          router.replace(redirectTo);
          return;
        }

        // Token is valid, allow access
        setIsVerifying(false);
        return;
      }

      // No token or not authenticated, redirect to login
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to', redirectTo);
        router.replace(redirectTo);
        return;
      }

      // We're authenticated but somehow don't have a token
      // This is an edge case - we'll still mark as verified
      setIsVerifying(false);
    };

    // Run verification, but give time for hydration to complete
    const timer = setTimeout(() => {
      verifyAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, tokens, router, dispatch, redirectTo]);

  // Show loading indicator while verifying
  if (isVerifying) {
    return (
      <div className="container mx-auto flex min-h-screen max-w-7xl items-center justify-center">
        <div className="text-center">
          <div className="border-manga-400 mx-auto h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
          <p className="text-manga-300 mt-4">Verifying your access...</p>
        </div>
      </div>
    );
  }

  // Render children once authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
