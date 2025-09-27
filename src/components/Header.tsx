import { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Button } from './ui/button.tsx';
import React from 'react';


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Map', href: '#map' },
    { name: 'Submit', href: '#submit' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold font-['Roboto_Slab']">
                CrisisConnect
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white hover:text-accent transition-colors duration-200 px-3 py-2 rounded-md font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Login/User Icon */}
          <div className="hidden md:flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-accent hover:bg-white/10"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-accent hover:bg-white/10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-primary">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white hover:text-accent block px-3 py-2 rounded-md font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="border-t border-white/20 pt-3 mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-accent hover:bg-white/10 w-full justify-start"
              >
                <User className="h-5 w-5 mr-2" />
                Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}