import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Simple Header */}
      <header className="py-6">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="font-serif text-2xl font-semibold text-foreground">
              Minell's
            </span>
            <span className="text-sm text-muted-foreground font-light tracking-wider">
              SALON
            </span>
          </Link>
        </div>
      </header>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Minell's Hair, Nail & Lashes Salon</p>
        </div>
      </footer>
    </div>
  );
};
