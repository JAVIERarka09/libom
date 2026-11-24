'use client';

import React from 'react';
import Link from 'next/link';
import { User, Role } from '../lib/types';
import { Icons } from './Icons';

interface NavbarProps {
  currentUser: User | null;
  allUsers: User[];
  onSwitchUser: (user: User) => void;
  activeTab: 'katalog' | 'riwayat' | 'admin_dashboard';
  setActiveTab: (tab: 'katalog' | 'riwayat' | 'admin_dashboard') => void;
  onResetData: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  activeTab,
  setActiveTab,
  onResetData,
  onOpenAuthModal,
  onLogout,
}) => {
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300';
      case 'petugas':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300';
      case 'pelanggan':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

          {/* Brand Logo */}
          <Link 
            href="/"
            onClick={() => setActiveTab('katalog')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Icons.Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                  AUTOLUXE<span className="text-blue-600">.</span>
                </span>
                <span className="hidden md:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
                Sistem Persewaan Mobil Terpadu
              </p>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
            <button
              onClick={() => setActiveTab('katalog')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${activeTab === 'katalog'
                ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
            >
              <Icons.Car className="w-4 h-4" />
              Katalog Mobil
            </button>

            {currentUser && currentUser.role === 'pelanggan' && (
              <button
                onClick={() => setActiveTab('riwayat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${activeTab === 'riwayat'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                  }`}
              >
                <Icons.FileText className="w-4 h-4" />
                Riwayat Rental Saya
              </button>
            )}

            {currentUser && (currentUser.role === 'admin' || currentUser.role === 'petugas') && (
              <button
                onClick={() => setActiveTab('admin_dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${activeTab === 'admin_dashboard'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                  }`}
              >
                <Icons.Settings className="w-4 h-4" />
                Panel {currentUser.role === 'admin' ? 'Administrator' : 'Petugas'}
              </button>
            )}
          </nav>

          {/* Right Action / Auth Area */}
          <div className="flex items-center gap-2.5">

            {/* If NOT logged in: Direct Links to /login and /register */}
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                >
                  <Icons.Key className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Masuk</span>
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
                >
                  <Icons.User className="w-3.5 h-3.5" />
                  <span>Daftar Akun</span>
                </Link>
              </div>
            ) : (
              /* If Logged In: Show User Profile, Fast Role Switcher, & Logout */
              <div className="flex items-center gap-2">
                
                {/* Role Switcher Selector for UKK evaluation */}
                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/60 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-[10px] text-zinc-400 font-medium">Akun Aktif:</span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[110px]">
                      {currentUser.nama}
                    </span>
                  </div>

                  <select
                    value={currentUser.id}
                    onChange={(e) => {
                      const selected = allUsers.find((u) => u.id === e.target.value);
                      if (selected) {
                        onSwitchUser(selected);
                        if (selected.role === 'admin' || selected.role === 'petugas') {
                          setActiveTab('admin_dashboard');
                        } else {
                          setActiveTab('katalog');
                        }
                      }
                    }}
                    className="text-xs font-bold bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 py-1 px-2 rounded-xl border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
                  >
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        [{u.role.toUpperCase()}] {u.nama}
                      </option>
                    ))}
                  </select>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border hidden sm:inline-block ${getRoleBadge(
                      currentUser.role
                    )}`}
                  >
                    {currentUser.role}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  title="Keluar dari Akun"
                  className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-zinc-200 dark:border-zinc-700 transition-colors flex items-center gap-1"
                >
                  <Icons.LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Keluar</span>
                </button>
              </div>
            )}

            {/* Reset Data Button */}
            <button
              onClick={() => {
                if (confirm('Kembalikan seluruh data ke kondisi awal ')) {
                  onResetData();
                }
              }}
              title="Reset Database Bawaan UKK"
              className="p-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
            >
              <Icons.RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('katalog')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold ${activeTab === 'katalog' ? 'text-blue-600 bg-blue-50 dark:bg-blue-950' : 'text-zinc-600'
              }`}
          >
            <Icons.Car className="w-3.5 h-3.5" />
            Katalog
          </button>
          {currentUser && currentUser.role === 'pelanggan' && (
            <button
              onClick={() => setActiveTab('riwayat')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold ${activeTab === 'riwayat' ? 'text-blue-600 bg-blue-50 dark:bg-blue-950' : 'text-zinc-600'
                }`}
            >
              <Icons.FileText className="w-3.5 h-3.5" />
              Riwayat
            </button>
          )}
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'petugas') && (
            <button
              onClick={() => setActiveTab('admin_dashboard')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold ${activeTab === 'admin_dashboard' ? 'text-blue-600 bg-blue-50 dark:bg-blue-950' : 'text-zinc-600'
                }`}
            >
              <Icons.Settings className="w-3.5 h-3.5" />
              Dashboard
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
