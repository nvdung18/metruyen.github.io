'use client';
import React, { useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import { useAppDispatch } from '@/lib/redux/hook';
import { hydrate } from '@/lib/redux/slices/authSlice';

const LayoutNonDashboard = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // This only runs on the client after hydration
    dispatch(hydrate());
  }, [dispatch]);
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default LayoutNonDashboard;
