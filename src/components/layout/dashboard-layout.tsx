'use client';

import type React from 'react';
import {
  BarChart3,
  Bookmark,
  BookOpen,
  FolderTree,
  LogOut,
  Menu,
  Settings,
  User,
  Users
} from 'lucide-react';
import { AppSidebar } from '../custom-component/app-sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import Link from 'next/link';
import ProtectedRoute from '@/middleware/protectRoute';
import { useAppDispatch } from '@/lib/redux/hook';
import { useEffect } from 'react';
import { hydrate, logout } from '@/lib/redux/slices/authSlice';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from '../ui/sidebar';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    title: 'Manga',
    href: '/dashboard/manga',
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    title: 'Categories',
    href: '/dashboard/categories',
    icon: <FolderTree className="h-5 w-5" />
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: <Users className="h-5 w-5" />
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings className="h-5 w-5" />
  }
];

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // This only runs on the client after hydration
    dispatch(hydrate());
  }, [dispatch]);
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex flex-1 overflow-hidden p-4">
          <div className="w-full">
            {/* User Dropdown */}
            <div className="flex items-center justify-between">
              <SidebarTrigger>
                <div className="block md:hidden">
                  <Menu className="h-10 w-10" />
                </div>
              </SidebarTrigger>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* <Button variant="ghost" size="lg" className="rounded-full"> */}
                  <div className="mb-3">
                    <div className="hover:bg-manga/50 border-manga-200 ml-auto inline-flex cursor-pointer rounded-full border-2 p-1">
                      <User className="h-7 w-7" />
                    </div>
                  </div>
                  {/* </Button> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookmarks" className="w-full cursor-pointer">
                      <Bookmark className="mr-2 h-4 w-4" />
                      <span>Bookmarks</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        'w-full cursor-pointer justify-start border-0'
                      )}
                      onClick={() => dispatch(logout())}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="min-h-screen flex-grow overflow-y-auto transition-all duration-500 ease-in-out">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
