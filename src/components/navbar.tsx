"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Moon, Sun, Building2, Menu } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show global navbar on admin routes as they have their own sidebar
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <Link href="/" className="font-bold text-xl tracking-tight">
            CityPulse
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          {session?.user.role === 'ADMIN' && (
            <>
              <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Admin Panel
              </Link>
              <Link href="/analytics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Analytics
              </Link>
            </>
          )}

          <div className="flex items-center gap-4 ml-4 border-l pl-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </button>

            {session ? (
              <button 
                onClick={() => signOut()}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary/10 text-primary hover:bg-primary/20 h-9 px-4 py-2"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex gap-2">
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  Log in
                </Link>
                <Link 
                  href="/register"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-4 bg-background">
          <Link href="/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
          {session?.user.role === 'ADMIN' && (
            <>
              <Link href="/admin" className="text-sm font-medium">
                Admin Panel
              </Link>
              <Link href="/analytics" className="text-sm font-medium">
                Analytics
              </Link>
            </>
          )}
          <div className="pt-2 border-t flex flex-col gap-2">
            {session ? (
              <button 
                onClick={() => signOut()}
                className="w-full justify-start inline-flex items-center rounded-md text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 h-9 px-4 py-2"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
                >
                  Log in
                </Link>
                <Link 
                  href="/register"
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
