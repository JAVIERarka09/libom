'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car, Transaction, User, CarStatus, TransactionStatus } from '../lib/types';
import {
  getCars,
  saveCars,
  getTransactions,
  saveTransactions,
  getUsers,
  saveUsers,
  getCurrentUser,
  saveCurrentUser,
  resetAllDataToDefault,
} from '../lib/storage';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { CarCatalog } from '../components/CarCatalog';
import { CarDetailModal } from '../components/CarDetailModal';
import { CustomerHistory } from '../components/CustomerHistory';
import { AdminDashboard } from '../components/AdminDashboard';
import { CarFormModal } from '../components/CarFormModal';
import { ReturnModal } from '../components/ReturnModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { PrintReportModal } from '../components/PrintReportModal';
import { AuthModal } from '../components/AuthModal';
import { Icons } from '../components/Icons';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Core data states
  const [cars, setCars] = useState<Car[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // UI Navigation states
  const [activeTab, setActiveTab] = useState<'katalog' | 'riwayat' | 'admin_dashboard'>('katalog');

  // Auth Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Modal states
  const [selectedCarForDetail, setSelectedCarForDetail] = useState<Car | null>(null);
  const [selectedCarForEdit, setSelectedCarForEdit] = useState<Car | null>(null);
  const [isCarFormModalOpen, setIsCarFormModalOpen] = useState(false);
  const [selectedTrxForReturn, setSelectedTrxForReturn] = useState<Transaction | null>(null);
  const [selectedTrxForInvoice, setSelectedTrxForInvoice] = useState<Transaction | null>(null);
  const [isPrintReportModalOpen, setIsPrintReportModalOpen] = useState(false);
  const [reportConfig, setReportConfig] = useState<{
    list: Transaction[];
    startDate: string;
    endDate: string;
  }>({
    list: [],
    startDate: '2026-11-01',
    endDate: '2026-11-30',
  });

  // Toast Notification state
  const [toast, setToast] = useState<{
    text: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load initial data on client mount
  useEffect(() => {
    setMounted(true);
    const initialCars = getCars();
    const initialTrx = getTransactions();
    const initialUsers = getUsers();
    const activeUser = getCurrentUser();

    setCars(initialCars);
    setTransactions(initialTrx);
    setUsers(initialUsers);
    setCurrentUser(activeUser);

    if (activeUser && (activeUser.role === 'admin' || activeUser.role === 'petugas')) {
      setActiveTab('admin_dashboard');
    } else {
      setActiveTab('katalog');
    }
  }, []);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    saveCurrentUser(user);
    showToast(`Selamat datang kembali, ${user.nama}!`, 'success');

    if (user.role === 'admin' || user.role === 'petugas') {
      setActiveTab('admin_dashboard');
    } else {
      setActiveTab('katalog');
    }
  };

  const handleRegisterSuccess = (newUser: User) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    setCurrentUser(newUser);
    saveCurrentUser(newUser);
    showToast(
      `Pendaftaran berhasil! Selamat datang, ${newUser.nama} (${newUser.role.toUpperCase()})`,
      'success'
    );

    if (newUser.role === 'admin') {
      setActiveTab('admin_dashboard');
    } else {
      setActiveTab('katalog');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
    setActiveTab('katalog');
    showToast('Anda telah keluar dari akun.', 'info');
  };

  // Handlers
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    saveCurrentUser(user);
    showToast(`Beralih ke akun [${user.role.toUpperCase()}] ${user.nama}`, 'info');
  };

  const handleResetData = () => {
    resetAllDataToDefault();
    const initialCars = getCars();
    const initialTrx = getTransactions();
    const initialUsers = getUsers();
    const activeUser = getCurrentUser();

    setCars(initialCars);
    setTransactions(initialTrx);
    setUsers(initialUsers);
    setCurrentUser(activeUser);
    showToast('Database rental berhasil dikembalikan ke kondisi awal soal UKK!', 'success');
  };

  const handleBookingSuccess = (newTrx: Transaction) => {
    const updated = [newTrx, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);

    showToast(
      `Pemesanan ${newTrx.carName} berhasil dibuat! Kode: ${newTrx.kodeTransaksi}`,
      'success'
    );
    setActiveTab('riwayat');
  };

  const handleSaveCar = (carData: Car) => {
    let updatedCars: Car[];
    const exists = cars.some((c) => c.id === carData.id);

    if (exists) {
      updatedCars = cars.map((c) => (c.id === carData.id ? carData : c));
      showToast(`Data mobil ${carData.nama} (${carData.platNomor}) berhasil diperbarui!`, 'success');
    } else {
      updatedCars = [carData, ...cars];
      showToast(`Unit mobil baru ${carData.nama} berhasil ditambahkan ke armada!`, 'success');
    }

    setCars(updatedCars);
    saveCars(updatedCars);
    setSelectedCarForEdit(null);
  };

  const handleDeleteCar = (carId: string) => {
    const target = cars.find((c) => c.id === carId);
    const updated = cars.filter((c) => c.id !== carId);
    setCars(updated);
    saveCars(updated);
    showToast(`Mobil ${target?.nama || ''} berhasil dihapus dari sistem.`, 'info');
  };

  const handleUpdateCarStatus = (carId: string, newStatus: CarStatus) => {
    const updated = cars.map((c) => (c.id === carId ? { ...c, status: newStatus } : c));
    setCars(updated);
    saveCars(updated);
    showToast(`Status ketersediaan armada diperbarui.`, 'info');
  };

  const handleUpdateTransactionStatus = (
    trxId: string,
    newStatus: TransactionStatus,
    carId?: string
  ) => {
    const updatedTrx = transactions.map((t) => {
      if (t.id === trxId) {
        return {
          ...t,
          statusTransaksi: newStatus,
          statusPembayaran: newStatus === 'dikonfirmasi' ? 'lunas' : t.statusPembayaran,
        };
      }
      return t;
    });

    setTransactions(updatedTrx);
    saveTransactions(updatedTrx);

    // If Handover keys (sedang_disewa): set car to 'disewa'
    if (newStatus === 'sedang_disewa' && carId) {
      const updatedCars = cars.map((c) =>
        c.id === carId ? { ...c, status: 'disewa' as CarStatus } : c
      );
      setCars(updatedCars);
      saveCars(updatedCars);
    }

    // If Cancelled: set car back to 'tersedia'
    if (newStatus === 'dibatalkan' && carId) {
      const updatedCars = cars.map((c) =>
        c.id === carId ? { ...c, status: 'tersedia' as CarStatus } : c
      );
      setCars(updatedCars);
      saveCars(updatedCars);
    }

    showToast(`Status transaksi berhasil diubah menjadi: ${newStatus.replace('_', ' ')}`, 'success');
  };

  const handleConfirmReturn = (updatedTransaction: Transaction) => {
    // 1. Update transaction
    const updatedTrxList = transactions.map((t) =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    setTransactions(updatedTrxList);
    saveTransactions(updatedTrxList);

    // 2. Set associated car back to 'tersedia'
    const updatedCars = cars.map((c) =>
      c.id === updatedTransaction.carId ? { ...c, status: 'tersedia' as CarStatus } : c
    );
    setCars(updatedCars);
    saveCars(updatedCars);

    showToast(
      `Pengembalian unit ${updatedTransaction.carName} selesai! Mobil kini kembali berstatus Tersedia.`,
      'success'
    );

    // Automatically open invoice for inspection
    setSelectedTrxForInvoice(updatedTransaction);
  };

  const handlePrintReportTrigger = (
    filteredList: Transaction[],
    startDate: string,
    endDate: string
  ) => {
    setReportConfig({
      list: filteredList,
      startDate,
      endDate,
    });
    setIsPrintReportModalOpen(true);
  };

  const handleAddUser = (newUser: User) => {
    const updated = [...users, newUser];
    setUsers(updated);
    saveUsers(updated);
    showToast(`Akun ${newUser.role} atas nama ${newUser.nama} berhasil didaftarkan!`, 'success');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Memuat Aplikasi Rental Mobil...
          </p>
        </div>
      </div>
    );
  }

  const availableCarsCount = cars.filter((c) => c.status === 'tersedia').length;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold text-white border ${toast.type === 'error'
              ? 'bg-rose-600 border-rose-500'
              : toast.type === 'info'
                ? 'bg-zinc-900 border-zinc-700'
                : 'bg-emerald-600 border-emerald-500'
              }`}
          >
            <Icons.CheckCircle className="w-4 h-4 shrink-0" />
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Sticky Header Navbar */}
      <Navbar
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
        onOpenAuthModal={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* MAIN VIEW CONTENT */}
      <main className="flex-1">
        {activeTab === 'katalog' && (
          <>
            <HeroSection
              totalCars={cars.length}
              availableCars={availableCarsCount}
              currentUser={currentUser}
              onExploreClick={() => {
                const el = document.getElementById('katalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAuthModal={(mode) => {
                setAuthModalMode(mode);
                setIsAuthModalOpen(true);
              }}
            />
            <CarCatalog
              cars={cars}
              onSelectCar={(car) => setSelectedCarForDetail(car)}
            />
          </>
        )}

        {activeTab === 'riwayat' && currentUser && (
          <CustomerHistory
            currentUser={currentUser}
            transactions={transactions}
            onViewInvoice={(trx) => setSelectedTrxForInvoice(trx)}
            onExploreCars={() => setActiveTab('katalog')}
          />
        )}

        {activeTab === 'riwayat' && !currentUser && (
          <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto">
              <Icons.User className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Silakan Masuk ke Akun Anda</h3>
            <p className="text-xs text-zinc-500">Anda perlu masuk untuk melihat riwayat transaksi rental mobil Anda.</p>
            <div className="flex gap-2 justify-center pt-2">
              <Link href="/login" className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md">Masuk</Link>
              <Link href="/register" className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs rounded-xl border border-zinc-200 dark:border-zinc-700">Daftar Akun</Link>
            </div>
          </div>
        )}

        {activeTab === 'admin_dashboard' && currentUser && (
          <AdminDashboard
            currentUser={currentUser}
            cars={cars}
            transactions={transactions}
            users={users}
            onAddCarClick={() => {
              setSelectedCarForEdit(null);
              setIsCarFormModalOpen(true);
            }}
            onEditCarClick={(car) => {
              setSelectedCarForEdit(car);
              setIsCarFormModalOpen(true);
            }}
            onDeleteCar={handleDeleteCar}
            onUpdateCarStatus={handleUpdateCarStatus}
            onUpdateTransactionStatus={handleUpdateTransactionStatus}
            onOpenReturnModal={(trx) => setSelectedTrxForReturn(trx)}
            onViewInvoice={(trx) => setSelectedTrxForInvoice(trx)}
            onPrintReport={handlePrintReportTrigger}
            onAddUser={handleAddUser}
          />
        )}

        {activeTab === 'admin_dashboard' && !currentUser && (
          <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center mx-auto">
              <Icons.Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Akses Panel Administrator Terbatas</h3>
            <p className="text-xs text-zinc-500">Hanya Administrator dan Petugas yang dapat mengakses panel ini. Silakan masuk atau daftar sebagai Admin.</p>
            <div className="flex gap-2 justify-center pt-2">
              <Link href="/login" className="px-5 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md">Masuk sebagai Admin</Link>
              <Link href="/register" className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs rounded-xl border border-zinc-200 dark:border-zinc-700">Daftar Akun Admin</Link>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="print:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Icons.Car className="w-4 h-4" />
                </div>
                <span className="font-black text-lg text-zinc-900 dark:text-white">
                  AUTOLUXE<span className="text-blue-600">.</span>
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Platform persewaan mobil profesional terlengkap untuk keperluan pribadi, dinas, dan wisata keluarga di seluruh Indonesia.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
                Menu Cepat
              </h4>
              <ul className="space-y-2 text-xs text-zinc-500">
                <li>
                  <button onClick={() => setActiveTab('katalog')} className="hover:text-blue-600">
                    Katalog Armada Mobil
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('riwayat')} className="hover:text-blue-600">
                    Riwayat Sewa & Pemesanan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('admin_dashboard')}
                    className="hover:text-blue-600"
                  >
                    Panel Manajemen Admin / Petugas
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
                Informasi UKK
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-500">
                <li>Paket Soal: <strong>Paket A (Persewaan Mobil)</strong></li>
                <li>Kompetensi: Rekayasa Perangkat Lunak (RPL)</li>
                <li>Tahun Ajaran: 2026/2027</li>
                <li>Fitur: Multi-Role, CRUD, Denda, Invoice & Laporan</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">
                Layanan Kontak
              </h4>
              <p className="text-xs text-zinc-500">
                Pusat Bantuan & Reservasi Rental:
              </p>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                (021) 555-0199 &bull; 0812-8899-0011
              </p>
              <div className="mt-3 text-[11px] text-zinc-400">
                Buka Setiap Hari: 06.00 - 23.00 WIB
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-400">
            &copy; 2026 AUTOLUXE Rental Mobil. Dirancang khusus untuk Uji Kompetensi Keahlian (UKK) Rekayasa Perangkat Lunak SMK.
          </div>
        </div>
      </footer>

      {/* ALL MODALS */}

      {/* 0. Modal Login & Register (Multi-Role) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        users={users}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />

      {/* 1. Modal Booking / Detail Mobil */}
      {currentUser && (
        <CarDetailModal
          car={selectedCarForDetail}
          currentUser={currentUser}
          onClose={() => setSelectedCarForDetail(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* 2. Modal Tambah / Edit Mobil (CRUD) */}
      <CarFormModal
        isOpen={isCarFormModalOpen}
        carToEdit={selectedCarForEdit}
        onClose={() => {
          setIsCarFormModalOpen(false);
          setSelectedCarForEdit(null);
        }}
        onSaveCar={handleSaveCar}
      />

      {/* 3. Modal Proses Pengembalian & Hitung Denda */}
      {currentUser && (
        <ReturnModal
          transaction={selectedTrxForReturn}
          currentUser={currentUser}
          onClose={() => setSelectedTrxForReturn(null)}
          onConfirmReturn={handleConfirmReturn}
        />
      )}

      {/* 4. Modal Cetak Nota Kuitansi Invoice */}
      <InvoiceModal
        transaction={selectedTrxForInvoice}
        onClose={() => setSelectedTrxForInvoice(null)}
      />

      {/* 5. Modal Cetak Laporan Rekapitulasi UKK */}
      <PrintReportModal
        isOpen={isPrintReportModalOpen}
        transactions={reportConfig.list}
        startDate={reportConfig.startDate}
        endDate={reportConfig.endDate}
        onClose={() => setIsPrintReportModalOpen(false)}
      />
    </div>
  );
}
