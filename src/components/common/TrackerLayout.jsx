import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Zap, BarChart3, Plus, List, Settings, ArrowLeft, Menu, X } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

export default function TrackerLayout({ children, type }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  const isTestDrive = type === 'testdrive';
  const baseUrl = `/${type}`;
  
  const navigation = [
    {
      name: 'Dashboard',
      href: baseUrl,
      icon: BarChart3,
      current: location.pathname === baseUrl
    },
    {
      name: 'Add New',
      href: `${baseUrl}/add`,
      icon: Plus,
      current: location.pathname === `${baseUrl}/add`
    },
    {
      name: 'Records',
      href: `${baseUrl}/list`,
      icon: List,
      current: location.pathname === `${baseUrl}/list`
    },
    {
      name: 'Settings',
      href: `${baseUrl}/settings`,
      icon: Settings,
      current: location.pathname === `${baseUrl}/settings`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo & Title */}
            <div className="flex items-center min-w-0 flex-1">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-3 sm:mr-6 flex-shrink-0">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm hidden xs:inline">Back</span>
              </Link>
              
              <div className="flex items-center min-w-0">
                <div className={`p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0 ${isTestDrive ? 'bg-blue-100' : 'bg-green-100'}`}>
                  {isTestDrive ? (
                    <Car className={`w-4 h-4 sm:w-6 sm:h-6 ${isTestDrive ? 'text-blue-600' : 'text-green-600'}`} />
                  ) : (
                    <Zap className={`w-4 h-4 sm:w-6 sm:h-6 ${isTestDrive ? 'text-blue-600' : 'text-green-600'}`} />
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-xl font-semibold text-gray-900 truncate">
                    {isTestDrive ? 'Test Drive' : 'Charging AC/DC'}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                    BYD Bekasi Timur
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                      item.current
                        ? isTestDrive 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Toggleable Dropdown Only */}
      {mobileMenuOpen && (
        <>
          {/* Overlay to close menu when clicking outside */}
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-20"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="lg:hidden bg-white border-b border-gray-200 sticky top-14 sm:top-16 z-30 shadow-lg">
            <div className="px-3 sm:px-4 py-3">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors flex items-center w-full ${
                        item.current
                          ? isTestDrive 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6">
          <Breadcrumb />
        </div>
        <div className="space-y-4 sm:space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
