'use client';

import { useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { User, LayoutDashboard, LogIn, UserPlus, LogOut, ChevronDown, ChevronUp } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="w-full border-b bg-white/70 backdrop-blur-sm top-0 z-30">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <h1
          className="text-xl font-semibold tracking-tight cursor-pointer"
          onClick={() => router.push('/')}
        >
          AptiCrack
        </h1>
        <div className="flex gap-3">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>

                  {/* Dropdown Menu */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition cursor-pointer"
                      style={{ backgroundColor: '#75B06F' }}
                    >
                      <User className="w-4 h-4" />
                      {dropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Dropdown Content */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Profile */}
                        <button
                          onClick={() => {
                            router.push('/profile');
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition border-b border-gray-100"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </button>

                        {/* Dashboard */}
                        <button
                          onClick={() => {
                            router.push('/dashboard');
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition border-b border-gray-100"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </button>

                        {/* Logout */}
                        <button
                          onClick={() => {
                            logout();
                            router.push('/');
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </button>
                  <button
                    onClick={() => router.push('/signup')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-[#75B06F] text-white hover:bg-[var(--color-primary-hover)] transition cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    Signup
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
