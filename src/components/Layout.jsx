import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Camera, List, Plus, Menu, X, Wifi, WifiOff } from 'lucide-react';
import { useTestDrive } from '../context/TestDriveContext';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isOnline, offlineQueue } = useTestDrive();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Car },
    { path: '/add', label: 'Add New', icon: Plus },
    { path: '/list', label: 'List', icon: List },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="bg-blue-700 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Car className="w-7 h-7" />
              <span className="font-bold text-lg tracking-wide hidden sm:block">
                BYD Test Drive Tracker
              </span>
              <span className="font-bold text-sm sm:hidden">BYD Tracker</span>
            </div>

            {/* Network Status & Offline Queue Indicator */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <div className="flex items-center gap-2 text-green-100">
                    <Wifi className="w-4 h-4" />
                    <span className="text-xs">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-200">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-xs">Offline</span>
                  </div>
                )}
                {offlineQueue.length > 0 && (
                  <div className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                    {offlineQueue.length} pending
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.path
                        ? 'bg-blue-600 font-semibold'
                        : 'hover:bg-blue-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-600">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        pathname === item.path
                          ? 'bg-blue-600 font-semibold'
                          : 'hover:bg-blue-600'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>

      <footer className="bg-blue-700 text-white text-center py-4 text-sm">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} BYD Test Drive System by @rakaafadh on IG
        </div>
      </footer>
    </div>
  );
}
