import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import React from 'react';


export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-['Roboto_Slab'] font-bold mb-4">
              CrisisConnect
            </h3>
            <p className="text-white/80 mb-6 max-w-md">
              Connecting communities through volunteer opportunities and donations during crises and beyond. 
              Together, we make a difference.
            </p>
            <div className="flex items-center text-white/80">
              <Heart className="h-5 w-5 mr-2 text-accent" />
              <span>Building stronger communities, one connection at a time.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-['Roboto_Slab'] font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-['Roboto_Slab'] font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center text-white/80">
                <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                <span>info@crisisconnect.org</span>
              </div>
              <div className="flex items-center text-white/80">
                <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                <span>(555) 123-HELP</span>
              </div>
              <div className="flex items-start text-white/80">
                <MapPin className="h-4 w-4 mr-3 flex-shrink-0 mt-0.5" />
                <span>123 Community St<br />Your City, State 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/80 text-sm mb-4 md:mb-0">
              © {currentYear} CrisisConnect. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-white/80 hover:text-accent transition-colors duration-200"
                aria-label="Facebook"
              >
                <span className="text-xl">📘</span>
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-accent transition-colors duration-200"
                aria-label="Twitter"
              >
                <span className="text-xl">🐦</span>
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-accent transition-colors duration-200"
                aria-label="Instagram"
              >
                <span className="text-xl">📷</span>
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-accent transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <span className="text-xl">💼</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}