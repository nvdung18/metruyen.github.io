'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  BookOpen,
  Search,
  User,
  Home,
  Bookmark,
  ChevronDown,
  Grid,
  TrendingUp,
  Settings,
  LogIn,
  ChevronRight,
  Tag,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MegaMenu from './MegaMenu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { logout } from '@/lib/redux/slices/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const mobileCategoriesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // When opening the menu, prevent scrolling on the body
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const toggleMegaMenu = () => {
    setMegaMenuOpen(!megaMenuOpen);
  };

  const closeMegaMenu = () => {
    setMegaMenuOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setMegaMenuOpen(false);
    document.body.style.overflow = '';
  };

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // For desktop mega menu
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setMegaMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Reset body overflow when component unmounts
      document.body.style.overflow = '';
    };
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // Sample categories for the mobile menu
  const genreCategories = [
    { id: 'action', name: 'Action' },
    { id: 'romance', name: 'Romance' },
    { id: 'horror', name: 'Horror' },
    { id: 'sci-fi', name: 'Sci-Fi' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'drama', name: 'Drama' },
    { id: 'mystery', name: 'Mystery' },
    { id: 'thriller', name: 'Thriller' },
    { id: 'sports', name: 'Sports' },
    { id: 'slice-of-life', name: 'Slice of Life' }
  ];

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home className="mr-1 h-4 w-4" /> },
    {
      name: 'Library',
      href: '/library',
      icon: <BookOpen className="mr-1 h-4 w-4" />
    },
    {
      name: 'Popular',
      href: '/manga/popular',
      icon: <TrendingUp className="mr-1 h-4 w-4" />
    }
  ];

  return (
    <>
      <nav className="border-border bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-lg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="from-manga-300 to-manga-500 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
                  MangaSphere
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'group relative px-3 py-2 text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-manga-400'
                      : 'text-foreground hover:text-manga-300'
                  )}
                >
                  <span className="flex items-center">
                    {link.icon}
                    {link.name}
                  </span>
                  <span
                    className={cn(
                      'bg-manga-500 absolute bottom-0 left-0 h-0.5 w-full scale-x-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-x-100',
                      pathname === link.href && 'scale-x-100'
                    )}
                  />
                </Link>
              ))}

              {/* Categories with mega menu */}
              <div className="relative" ref={categoriesRef}>
                <button
                  className={cn(
                    'group relative px-3 py-2 text-sm font-medium transition-colors',
                    megaMenuOpen
                      ? 'text-manga-400'
                      : 'text-foreground hover:text-manga-300'
                  )}
                  onClick={toggleMegaMenu}
                >
                  <span className="flex items-center">
                    <Grid className="mr-1 h-4 w-4" />
                    Categories
                    <ChevronDown
                      className={cn(
                        'ml-1 h-4 w-4 transition-transform duration-300',
                        megaMenuOpen && 'rotate-180'
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      'bg-manga-500 absolute bottom-0 left-0 h-0.5 w-full scale-x-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-x-100',
                      megaMenuOpen && 'scale-x-100'
                    )}
                  />
                </button>

                <MegaMenu isOpen={megaMenuOpen} onClose={closeMegaMenu} />
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-4">
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
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
                    {
                      /* Replace with logout function */
                      auth.token ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => dispatch(logout())}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Logout</span>
                        </Button>
                      ) : (
                        <Link href="/login" className="w-full cursor-pointer">
                          <LogIn className="mr-2 h-4 w-4" />
                          <span>Login</span>
                        </Link>
                      )
                    }
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {!auth.token && (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-manga-600 hover:bg-manga-700"
                    asChild
                  >
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="px-2"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Navigation */}
      <div
        className={cn(
          'bg-background fixed inset-x-0 top-16 bottom-0 z-40 transform overflow-y-auto transition-all duration-300 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col space-y-4 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'flex items-center rounded-lg px-4 py-3 transition-all duration-200',
                pathname === link.href
                  ? 'bg-accent text-manga-400'
                  : 'hover:bg-accent/50'
              )}
              onClick={closeMenu}
            >
              <span className="mr-3 transition-transform duration-300 ease-out group-hover:translate-x-1">
                {link.icon}
              </span>
              {link.name}
            </Link>
          ))}

          {/* Mobile Categories Button */}
          <div ref={mobileCategoriesRef}>
            <button
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-4 py-3 transition-all duration-200',
                megaMenuOpen ? 'bg-accent' : 'hover:bg-accent/50'
              )}
              onClick={() => {
                setMegaMenuOpen(!megaMenuOpen);
              }}
            >
              <div className="flex items-center">
                <Grid className="mr-3 h-5 w-5" />
                Categories
              </div>
              <ChevronDown
                className={cn(
                  'h-5 w-5 transition-transform duration-300',
                  megaMenuOpen && 'rotate-180'
                )}
              />
            </button>
            {/* Improved Mobile Mega Menu */}
            {megaMenuOpen && (
              <div className="animate-in slide-in-from-top-5 mt-2 duration-300">
                <div className="bg-card rounded-lg border shadow-sm">
                  {/* Popular Categories Section */}
                  <div className="p-4">
                    <h3 className="text-muted-foreground mb-3 text-sm font-medium">
                      Popular Categories
                    </h3>
                    <ScrollArea className="h-[30vh]">
                      <div className="grid grid-cols-2 gap-2 pb-4">
                        {genreCategories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/discover?genre=${category.id}`}
                            className="hover:bg-accent/70 active:bg-accent flex items-center gap-2 rounded-md p-2 transition-all duration-200"
                            onClick={closeMenu}
                          >
                            <span className="truncate text-sm font-medium">
                              {category.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Link for Mobile */}
          <Link
            href="/profile"
            className="hover:bg-accent flex items-center rounded-lg px-4 py-3"
            onClick={closeMenu}
          >
            <User className="mr-3 h-5 w-5" />
            Profile
          </Link>
          {auth.token && (
            <div className="space-y-3 pt-4">
              <Button
                variant="outline"
                className="hover:border-manga-400 w-full justify-start transition-all duration-300"
                asChild
              >
                <Link href="/login" onClick={closeMenu}>
                  <User className="mr-2 h-4 w-4" /> Sign In
                </Link>
              </Button>
              <Button
                className="bg-manga-600 hover:bg-manga-700 hover:shadow-manga-500/20 w-full justify-start transition-all duration-300 hover:shadow-md"
                asChild
              >
                <Link href="/register" onClick={closeMenu}>
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
