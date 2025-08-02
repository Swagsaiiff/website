import React from 'react';
import { Link } from 'wouter';
import { Mail, Phone, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-gaming-primary to-gaming-secondary p-2 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">GameTopUp Plus</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Professional gaming currency exchange platform with instant delivery and secure transactions.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/games">
                  <a className="text-gray-400 hover:text-gaming-accent transition-colors duration-200">Supported Games</a>
                </Link>
              </li>
              <li>
                <Link href="/orders">
                  <a className="text-gray-400 hover:text-gaming-accent transition-colors duration-200">Order History</a>
                </Link>
              </li>
              <li>
                <Link href="/wallet">
                  <a className="text-gray-400 hover:text-gaming-accent transition-colors duration-200">Wallet</a>
                </Link>
              </li>
              <li>
                <a href="#support" className="text-gray-400 hover:text-gaming-accent transition-colors duration-200">Support</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#faq" className="text-gray-400 hover:text-gaming-accent transition-colors duration-200">FAQ</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-gaming-accent transition-colors duration-200">Contact Us</a></li>
              <li><a href="#terms" className="text-gray-400 hover:text-gaming-accent transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#privacy" className="text-gray-400 hover:text-gaming-accent transition-colors duration-200">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gaming-accent" />
                <span className="text-gray-400 text-sm">support@gametopupplus.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gaming-accent" />
                <span className="text-gray-400 text-sm">+880 1XXX-XXXXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gaming-accent" />
                <span className="text-gray-400 text-sm">24/7 Support Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 mt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 GameTopUp Plus. All rights reserved. Professional gaming currency exchange.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;