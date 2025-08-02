import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, Wallet, LogOut, User, Settings, Shield } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const formatCurrency = (amount: number) => {
    return `৳ ${amount.toLocaleString()}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-4 cursor-pointer">
              <div className="bg-gradient-to-r from-gaming-primary to-gaming-secondary p-2 rounded-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">GameTopUp Plus</h1>
                <p className="text-xs text-gray-400">Professional Gaming Currency</p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/games">
              <a className={`text-gray-300 hover:text-gaming-accent transition-colors duration-200 font-medium ${
                location === '/games' ? 'text-gaming-accent' : ''
              }`}>
                Games
              </a>
            </Link>
            <Link href="/orders">
              <a className={`text-gray-300 hover:text-gaming-accent transition-colors duration-200 font-medium ${
                location === '/orders' ? 'text-gaming-accent' : ''
              }`}>
                Orders
              </a>
            </Link>
            <Link href="/wallet">
              <a className={`text-gray-300 hover:text-gaming-accent transition-colors duration-200 font-medium ${
                location === '/wallet' ? 'text-gaming-accent' : ''
              }`}>
                Wallet
              </a>
            </Link>
            {user.role === 'admin' && (
              <Link href="/admin">
                <a className={`text-gaming-warning hover:text-yellow-300 transition-colors duration-200 font-medium ${
                  location === '/admin' ? 'text-yellow-300' : ''
                }`}>
                  Admin
                </a>
              </Link>
            )}
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {/* Wallet Balance */}
            <div className="bg-gray-800 px-3 py-2 rounded-lg flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-gaming-accent" />
              <span className="text-sm font-semibold">{formatCurrency(user.wallet)}</span>
            </div>
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-800 rounded-lg p-2 transition-colors">
                  <Avatar className="h-8 w-8 border-2 border-gaming-primary">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gaming-primary text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <div className="flex items-center space-x-2 w-full">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <div className="flex items-center space-x-2 w-full">
                        <Shield className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300">
                  <div className="flex items-center space-x-2 w-full">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button variant="ghost" className="md:hidden p-2">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;