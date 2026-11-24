'use client';

import React from 'react';
import Link from 'next/link';
import { Icons } from './Icons';
import { User } from '../lib/types';

interface HeroSectionProps {
  onExploreClick: () => void;
  totalCars: number;
  availableCars: number;
  currentUser?: User | null;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  totalCars,
  availableCars,
  currentUser,
  onOpenAuthModal,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-r from-blue-400/15 via-indigo-400/20 to-purple-400/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20 relative">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Top Pill / User Greeting */}
          {currentUser ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Halo, {currentUser.nama}! Anda masuk sebagai{' '}
                <strong className="uppercase font-black tracking-wider">[{currentUser.role}]</strong>
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6">
              <Icons.Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Platform Persewaan Mobil Profesional & Terpercaya</span>
            </div>
          )}

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
            Jelajahi Perjalanan Anda dengan{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Armada Terbaik
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Penyewaan mobil lepas kunci maupun dengan supir berpengalaman. Proses pemesanan cepat, unit higienis bergaransi prima, dan tarif transparan tanpa biaya tersembunyi.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Icons.Car className="w-4 h-4" />
              <span>Lihat Armada ({availableCars} Unit Siap)</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </button>

            {/* If NOT logged in: Show Registration and Login options */}
            {!currentUser ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Icons.User className="w-4 h-4" />
                  <span>Daftar Akun Baru</span>
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs sm:text-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Icons.Key className="w-4 h-4 text-zinc-500" />
                  <span>Masuk</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 py-3.5 px-5 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                <Icons.Shield className="w-4 h-4 text-emerald-500" />
                <span>Garansi All-Risk & Bebas Mogok</span>
              </div>
            )}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="bg-white/80 dark:bg-zinc-900/80 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-sm shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Icons.Key className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">Lepas Kunci</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Bebas kemudi mandiri dengan syarat KTP & SIM mudah</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-zinc-900/80 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-sm shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Icons.User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">Supir Ahli</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Driver ramah, hafal rute, siap mendampingi perjalanan</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-zinc-900/80 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-sm shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Icons.Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">Unit Higienis</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Selalu dicuci, disinfeksi, dan diservis berkala</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-zinc-900/80 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-sm shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Icons.Printer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">Nota Resmi</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Invoice digital lengkap untuk keperluan pribadi / kantor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
