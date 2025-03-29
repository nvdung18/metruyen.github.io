"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <h1 className="text-6xl md:text-8xl font-bold text-manga-500 mb-4">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. The journey
        continues elsewhere!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-manga-600 hover:bg-manga-700">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/library">
            <Search className="mr-2 h-4 w-4" />
            Browse Library
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
