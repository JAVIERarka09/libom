'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUsers, saveCurrentUser } from '../../lib/storage';
import { Icons } from '../../components/Icons';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const users = getUsers();
    const targetUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!targetUser) {
      setErrorMsg('Email tidak terdaftar! Silakan periksa kembali atau daftar akun baru.');
      return;
    }

    const validPass = (targetUser as typeof targetUser & { password?: string }).password ||
      (targetUser.role === 'admin' ? 'admin' : '123');
    if (password !== validPass) {
      setErrorMsg('Kata sandi yang Anda masukkan salah.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      saveCurrentUser(targetUser);
      router.push('/');
    }, 400);
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Side: Brand Visual & UKK Info */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <Icons.Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block">
                  AUTOLUXE<span className="text-blue-300">.</span>
                </span>
                <span className="text-[10px] text-blue-100 font-semibold uppercase tracking-wider block">
                  Rental Mobil UKK Paket A
                </span>
              </div>
            </Link>

            <div className="mt-12 space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase border border-white/20">
                Pintu Akses Sistem
                Pintu Akses Terproteksi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Selamat Datang di Portal Persewaan Mobil
                Portal Masuk Sistem Persewaan Mobil
              </h2>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Masuk untuk menikmati kemudahan sewa mobil lepas kunci maupun dengan supir, atau akses panel administrator untuk manajemen armada.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 text-xs text-blue-100/80 space-y-1">
            <p className="font-semibold text-white">Standar Uji Kompetensi Keahlian (UKK)</p>
            <p className="text-[11px]">Rekayasa Perangkat Lunak SMK Tahun 2026/2027</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Form Title */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                  Masuk ke Akun
                </h3>
                <Link
                  href="/"
                  className="text-xs font-semibold text-zinc-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <Icons.ArrowLeft className="w-3.5 h-3.5" />
                  <span>Katalog</span>
                </Link>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Gunakan email dan kata sandi akun Anda untuk melanjutkan
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2.5">
                <Icons.AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Alamat Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@example.com"
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-zinc-400 hover:text-zinc-600 font-medium"
                  >
                    {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Icons.Key className="w-4 h-4" />
                <span>{isSubmitting ? 'Memproses Masuk...' : 'Masuk Sekarang'}</span>
              </button>
            </form>

            {/* Quick-Fill UKK Demo Accounts */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Akun Uji Coba Cepat (Penguji UKK):
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@autoluxe.id', 'admin')}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-center hover:bg-purple-50 transition-colors shadow-sm"
                >
                  <span className="block text-xs">Admin</span>
                  <span className="text-[9px] font-normal text-zinc-400">admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('petugas@autoluxe.id', 'petugas')}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-center hover:bg-blue-50 transition-colors shadow-sm"
                >
                  <span className="block text-xs">Petugas</span>
                  <span className="text-[9px] font-normal text-zinc-400">petugas</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('siti@gmail.com', '123')}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-center hover:bg-emerald-50 transition-colors shadow-sm"
                >
                  <span className="block text-xs">Pelanggan</span>
                  <span className="text-[9px] font-normal text-zinc-400">123</span>
                </button>
              </div>
            </div>

            {/* Link to Register */}
            <div className="text-center pt-2 text-xs text-zinc-500">
              Belum memiliki akun?{' '}
              <Link
                href="/register"
                className="font-bold text-blue-600 hover:underline"
              >
                Daftar sebagai Pelanggan atau Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
