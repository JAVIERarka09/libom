'use client';

import React, { useState, useEffect } from 'react';
import { Role, User } from '../lib/types';
import { Icons } from './Icons';

export interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  users: User[];
  onLoginSuccess: (user: User) => void;
  onRegisterSuccess: (newUser: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  users,
  onLoginSuccess,
  onRegisterSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regNama, setRegNama] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<Role>('pelanggan');
  const [regPhone, setRegPhone] = useState('');
  const [regKtp, setRegKtp] = useState('');
  const [regAlamat, setRegAlamat] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetUser = users.find(
      (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (!targetUser) {
      setErrorMsg('Email tidak terdaftar! Silakan periksa kembali atau lakukan pendaftaran.');
      return;
    }

    const validPassword = (targetUser as User & { password?: string }).password || (targetUser.role === 'admin' ? 'admin' : '123');
    if (loginPassword !== validPassword) {
      setErrorMsg('Kata sandi yang Anda masukkan salah.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(targetUser);
      onClose();
    }, 300);
  };

  // Quick fill demo accounts
  const handleQuickFill = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setErrorMsg('');
  };

  // Handle Register Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regNama.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Nama lengkap, email, dan kata sandi wajib diisi!');
      return;
    }

    const exists = users.some(
      (u) => u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );
    if (exists) {
      setErrorMsg('Email sudah terdaftar. Silakan gunakan email lain atau langsung masuk.');
      return;
    }

    if (regPassword.length < 3) {
      setErrorMsg('Kata sandi minimal 3 karakter.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    setIsSubmitting(true);

    const newUser = {
      id: `usr-${Date.now()}`,
      nama: regNama.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword,
      role: regRole,
      noHp: regPhone.trim() || '0812-3456-7890',
      noKtp: regKtp.trim() || '3171000000000000',
      noSim: '990000000000',
      alamat: regAlamat.trim() || 'DKI Jakarta',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onRegisterSuccess(newUser);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header & Tab Toggle */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Icons.User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {mode === 'login' ? 'Masuk ke Akun Anda' : 'Daftar Akun Baru'}
              </h3>
              <p className="text-[11px] text-zinc-500">
                {mode === 'login'
                  ? 'Gunakan akun yang telah terdaftar untuk melanjutkan'
                  : 'Registrasi sebagai Pelanggan atau Administrator'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons (Login vs Register) */}
        <div className="grid grid-cols-2 p-1.5 m-5 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Masuk (Login)
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Daftar (Register)
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-5 mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
            <Icons.AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="px-6 pb-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@autoluxe.id atau email anda"
                  required
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  required
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs font-medium"
                >
                  {showLoginPassword ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <Icons.Key className="w-4 h-4" />
              <span>{isSubmitting ? 'Memeriksa Kredensial...' : 'Masuk ke Sistem Rental'}</span>
            </button>

            {/* Quick Demo Fill Buttons (For Examiner Convenience) */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Pilih Akun Uji Coba Cepat (UKK Demo):
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@autoluxe.id', 'admin')}
                  className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold text-center transition-colors"
                >
                  <span className="block font-bold">Admin</span>
                  <span className="text-[9px] opacity-75">admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('petugas@autoluxe.id', 'petugas')}
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold text-center transition-colors"
                >
                  <span className="block font-bold">Petugas</span>
                  <span className="text-[9px] opacity-75">petugas</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('siti@gmail.com', '123')}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-center transition-colors"
                >
                  <span className="block font-bold">Pelanggan</span>
                  <span className="text-[9px] opacity-75">123</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-2 text-xs text-zinc-500">
              Belum memiliki akun?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Daftar sekarang
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {mode === 'register' && (
          <form
            onSubmit={handleRegisterSubmit}
            className="px-6 pb-6 space-y-3.5 max-h-[70vh] overflow-y-auto"
          >
            {/* Role Selection (Customer vs Admin) */}
            <div>
              <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-1.5">
                Pilih Tipe Pendaftaran Akun *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('pelanggan')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    regRole === 'pelanggan'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icons.User className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold">Pelanggan / Peminjam</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                    Bisa pesan & sewa mobil, lihat riwayat, cetak kuitansi.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('admin')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    regRole === 'admin'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icons.Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold">Administrator Rental</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                    Akses penuh dashboard, kelola armada mobil, laporan UKK.
                  </p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={regNama}
                  onChange={(e) => setRegNama(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzan"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Alamat Email (Username Login) *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="ahmad@gmail.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Kata Sandi *
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimal 3 karakter"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-medium"
                  >
                    {showRegPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Ulangi Kata Sandi *
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi password"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nomor NIK KTP
                </label>
                <input
                  type="text"
                  value={regKtp}
                  onChange={(e) => setRegKtp(e.target.value)}
                  placeholder="16 digit NIK"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  value={regAlamat}
                  onChange={(e) => setRegAlamat(e.target.value)}
                  placeholder="Alamat domisili"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 ${
                regRole === 'admin'
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/25'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
              }`}
            >
              <Icons.CheckCircle className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Mendaftarkan Akun...'
                  : `Daftar Sekarang Sebagai ${regRole === 'admin' ? 'Admin' : 'Pelanggan'}`}
              </span>
            </button>

            <div className="text-center pt-1 text-xs text-zinc-500">
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Masuk di sini
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

