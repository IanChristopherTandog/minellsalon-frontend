import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { InquiryChat } from '@/components/inquiry/InquiryChat';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/hairstyles', label: 'Hairstyles' },
  { href: '/contact', label: 'Contact' },
];

export const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Top Bar */}
      <div className="hidden md:block bg-primary/5 border-b border-border/50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <address className="flex items-center gap-6 not-italic">
              <a href="tel:+15551234567" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                <span>+1 (555) 123-4567</span>
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                <span>123 Beauty Lane, Suite 100</span>
              </span>
            </address>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Mon - Sat: 9AM - 6PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16 md:h-20" aria-label="Main navigation">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2" aria-label="Minell's Salon - Home">
              <span className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
                Minell's
              </span>
              <span className="hidden sm:inline text-sm text-muted-foreground font-light tracking-wider">
                SALON
              </span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-8" role="menubar">
              {navLinks.map(link => (
                <li key={link.href} role="none">
                  <Link
                    to={link.href}
                    role="menuitem"
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-primary',
                      isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                    )}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to={user?.role === 'ADMIN' ? '/admin' : '/client'}>
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
              <Link to="/book">
                <Button size="sm" className="btn-shine">
                  Book Now
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="lg:hidden border-t border-border bg-background animate-fade-in-down">
            <div className="container mx-auto px-4 py-4">
              <nav aria-label="Mobile navigation">
                <ul className="flex flex-col gap-2">
                  {navLinks.map(link => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                          isActive(link.href)
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted'
                        )}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border mt-2 pt-4 flex flex-col gap-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to={user?.role === 'ADMIN' ? '/admin' : '/client'}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button variant="ghost" className="w-full justify-start">
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                  )}
                  <Link to="/book" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Book Now</Button>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-jet text-white" role="contentinfo">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <section aria-labelledby="footer-brand">
              <h2 id="footer-brand" className="font-serif text-2xl font-semibold text-gold gold-shimmer">Minell's</h2>
              <p className="text-white/70 text-sm leading-relaxed mt-4">
                Your destination for luxury hair, nail, and lash services. Where beauty meets elegance.
              </p>
              <nav aria-label="Social media" className="flex gap-4 mt-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-gold transition-colors" aria-label="Follow us on Facebook">
                  <Facebook className="h-5 w-5" aria-hidden="true" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-gold transition-colors" aria-label="Follow us on Instagram">
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-gold transition-colors" aria-label="Follow us on Twitter">
                  <Twitter className="h-5 w-5" aria-hidden="true" />
                </a>
              </nav>
            </section>

            {/* Quick Links */}
            <nav aria-labelledby="footer-quick-links">
              <h3 id="footer-quick-links" className="font-semibold mb-4 text-gold">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/70">
                {navLinks.map(link => (
                  <li key={link.href}>
                    <Link to={link.href} className="hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Services */}
            <nav aria-labelledby="footer-services">
              <h3 id="footer-services" className="font-semibold mb-4 text-gold">Services</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link to="/services?category=Hair" className="hover:text-gold transition-colors">
                    Hair Services
                  </Link>
                </li>
                <li>
                  <Link to="/services?category=Nail" className="hover:text-gold transition-colors">
                    Nail Services
                  </Link>
                </li>
                <li>
                  <Link to="/services?category=Lashes" className="hover:text-gold transition-colors">
                    Lash Services
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Contact */}
            <section aria-labelledby="footer-contact">
              <h3 id="footer-contact" className="font-semibold mb-4 text-gold">Contact Us</h3>
              <address className="not-italic">
                <ul className="space-y-3 text-sm text-white/70">
                  <li className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gold" aria-hidden="true" />
                    <span>123 Beauty Lane, Suite 100<br />Los Angeles, CA 90001</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="h-4 w-4 flex-shrink-0 text-gold" aria-hidden="true" />
                    <a href="tel:+15551234567" className="hover:text-gold transition-colors">+1 (555) 123-4567</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="h-4 w-4 flex-shrink-0 text-gold" aria-hidden="true" />
                    <span>Mon - Sat: 9AM - 6PM</span>
                  </li>
                </ul>
              </address>
            </section>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/50">
            <p>© {new Date().getFullYear()} Minell's Hair, Nail & Lashes Salon. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Inquiry Chat */}
      <InquiryChat isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
};
