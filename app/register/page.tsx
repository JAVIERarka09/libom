'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUsers, saveCurrentUser, saveUsers } from '../../lib/storage';
import { Role, User } from '../../lib/types';
import { Icons } from '../../components/Icons';

export default function RegisterPage() {
  const router = useRouter();

  // Form states
  const [role, setRole] = useState<Role>('pelanggan');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [ktp, setKtp] = useState('');
  const [sim, setSim] = useState('');
  const [alamat, setAlamat] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nama.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Nama lengkap, email, dan kata sandi wajib diisi!');
      return;
    }

    const currentUsers = getUsers();
    const isEmailTaken = currentUsers.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (isEmailTaken) {
      setErrorMsg('Email ini sudah terdaftar. Silakan gunakan email lain atau langsung masuk.');
      return;
    }

    if (password.length < 3) {
      setErrorMsg('Kata sandi minimal 3 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    setIsSubmitting(true);

    const newUser: User & { password: string } = {
      id: `usr-${Date.now()}`,
      nama: nama.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      noHp: phone.trim() || '0812-3456-7890',
      noKtp: ktp.trim() || '3171000000000000',
      noSim: sim.trim() || '990000000000',
      alamat: alamat.trim() || 'DKI Jakarta',
    };

    setTimeout(() => {
      saveUsers([...currentUsers, newUser]);
      saveCurrentUser(newUser);
      router.push('/');
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Side Visual */}
        <div className="lg:col-span-4 bg-gradient-to-br from-indigo-600 via-blue-600 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

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
                  Registrasi Akun Baru
                </span>
              </div>
            </Link>

            <div className="mt-12 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                Gabung Bersama AUTOLUXE
              </h2>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Pilih peran Anda sesuai kebutuhan: nikmati kemudahan sewa armada sebagai <strong>Pelanggan</strong>, atau kelola sistem operasional sebagai <strong>Admin</strong>.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-blue-100">
                  <Icons.CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Daftar Cepat Tanpa Biaya Pendaftaran</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Icons.CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pilihan Hak Akses Pelanggan & Admin</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Icons.CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Data Tersimpan Aman Secara Lokal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 text-xs text-blue-100/75">
             2026/2027
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-8 p-8 sm:p-12">
          <div className="max-w-xl w-full mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                  Pendaftaran Akun Baru
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Pilih hak akses akun dan lengkapi formulir di bawah ini
                </p>
              </div>

              <Link
                href="/"
                className="text-xs font-semibold text-zinc-500 hover:text-blue-600 flex items-center gap-1"
              >
                <Icons.ArrowLeft className="w-3.5 h-3.5" />
                <span>Katalog</span>
              </Link>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2.5">
                <Icons.AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-5">
              
              {/* Role Selection Cards (Pelanggan vs Admin) */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Pilih Peran Akun yang Didaftarkan *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Card Pelanggan */}
                  <div
                    onClick={() => setRole('pelanggan')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      role === 'pelanggan'
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-md ring-1 ring-emerald-500'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                        <Icons.User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black block">Pelanggan / Peminjam</span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Penyewa Kendaraan</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                      Dapat memesan mobil, memilih layanan supir & asuransi, serta mencetak bukti kuitansi.
                    </p>
                  </div>

                  {/* Card Admin */}
                  <div
                    onClick={() => setRole('admin')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      role === 'admin'
                        ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 shadow-md ring-1 ring-purple-500'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                        <Icons.Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black block">Administrator Rental</span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Pengelola Sistem</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                      Akses penuh ke dashboard, kelola armada (CRUD), serah kunci, proses denda, dan laporan UKK.
                    </p>
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Nama lengkap sesuai KTP"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Alamat Email (Username) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh@domain.com"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Kata Sandi *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 3 karakter"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Ulangi Kata Sandi *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Konfirmasi password"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Nomor HP / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Nomor NIK KTP *
                  </label>
                  <input
                    type="text"
                    required
                    value={ktp}
                    onChange={(e) => setKtp(e.target.value)}
                    placeholder="16 Digit NIK"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Alamat Lengkap Domisili *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Alamat tempat tinggal / kantor"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 ${
                  role === 'admin'
                    ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/25'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                }`}
              >
                <Icons.CheckCircle className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Mendaftarkan Akun...'
                    : `Selesaikan Pendaftaran Sebagai ${role === 'admin' ? 'Administrator' : 'Pelanggan'}`}
                </span>
              </button>
            </form>

            {/* Link to Login */}
            <div className="text-center pt-2 text-xs text-zinc-500">
              Sudah memiliki akun?{' '}
              <Link
                href="/login"
                className="font-bold text-blue-600 hover:underline"
              >
                Masuk di sini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
