'use client';

import React, { useState } from 'react';
import { Car, Transaction, User, CarStatus, TransactionStatus } from '../lib/types';
import {
  formatDateIndo,
  formatRupiah,
  getCarStatusBadge,
  getPaymentStatusBadge,
  getTransactionStatusBadge,
} from '../lib/format';
import { Icons } from './Icons';

interface AdminDashboardProps {
  currentUser: User;
  cars: Car[];
  transactions: Transaction[];
  users: User[];
  onAddCarClick: () => void;
  onEditCarClick: (car: Car) => void;
  onDeleteCar: (carId: string) => void;
  onUpdateCarStatus: (carId: string, newStatus: CarStatus) => void;
  onUpdateTransactionStatus: (
    trxId: string,
    newStatus: TransactionStatus,
    carId?: string
  ) => void;
  onOpenReturnModal: (trx: Transaction) => void;
  onViewInvoice: (trx: Transaction) => void;
  onPrintReport: (filteredTrx: Transaction[], startDate: string, endDate: string) => void;
  onAddUser: (newUser: User) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  cars,
  transactions,
  users,
  onAddCarClick,
  onEditCarClick,
  onDeleteCar,
  onUpdateCarStatus,
  onUpdateTransactionStatus,
  onOpenReturnModal,
  onViewInvoice,
  onPrintReport,
  onAddUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'transaksi' | 'armada' | 'laporan' | 'users'>(
    'transaksi'
  );

  // Filters for Armada
  const [carSearch, setCarSearch] = useState('');
  const [carStatusFilter, setCarStatusFilter] = useState<string>('all');

  // Filters for Transaksi
  const [trxFilterStatus, setTrxFilterStatus] = useState<string>('all');
  const [trxSearch, setTrxSearch] = useState('');

  // Filters for Laporan
  const [reportStartDate, setReportStartDate] = useState('2026-11-01');
  const [reportEndDate, setReportEndDate] = useState('2026-11-30');
  const [reportStatus, setReportStatus] = useState<string>('all');

  // New User Form State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'petugas' | 'pelanggan'>('petugas');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserKtp, setNewUserKtp] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');

  // Statistics
  const totalMobil = cars.length;
  const mobilTersedia = cars.filter((c) => c.status === 'tersedia').length;
  const mobilDisewa = cars.filter((c) => c.status === 'disewa').length;
  const mobilPerbaikan = cars.filter((c) => c.status === 'perbaikan').length;
  const totalTrx = transactions.length;
  const totalPendapatan = transactions
    .filter((t) => t.statusPembayaran === 'lunas')
    .reduce((acc, curr) => acc + (curr.totalBiayaAkhir || curr.totalBiaya), 0);

  // Filtered cars
  const filteredCars = cars.filter((car) => {
    const matchSearch =
      car.nama.toLowerCase().includes(carSearch.toLowerCase()) ||
      car.platNomor.toLowerCase().includes(carSearch.toLowerCase()) ||
      car.merk.toLowerCase().includes(carSearch.toLowerCase());
    const matchStatus = carStatusFilter === 'all' || car.status === carStatusFilter;
    return matchSearch && matchStatus;
  });

  // Filtered transactions
  const filteredTransactions = transactions.filter((trx) => {
    const matchStatus = trxFilterStatus === 'all' || trx.statusTransaksi === trxFilterStatus;
    const matchSearch =
      trx.kodeTransaksi.toLowerCase().includes(trxSearch.toLowerCase()) ||
      trx.userName.toLowerCase().includes(trxSearch.toLowerCase()) ||
      trx.carName.toLowerCase().includes(trxSearch.toLowerCase()) ||
      trx.carPlat.toLowerCase().includes(trxSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Filtered report transactions
  const reportTransactions = transactions.filter((trx) => {
    const trxDate = trx.tglMulai;
    const matchDate = trxDate >= reportStartDate && trxDate <= reportEndDate;
    const matchStatus = reportStatus === 'all' || trx.statusTransaksi === reportStatus;
    return matchDate && matchStatus;
  });

  const reportTotalRevenue = reportTransactions
    .filter((t) => t.statusPembayaran === 'lunas')
    .reduce((acc, curr) => acc + (curr.totalBiayaAkhir || curr.totalBiaya), 0);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const user: User = {
      id: `usr-${Date.now()}`,
      nama: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      noHp: newUserPhone.trim() || '0812-0000-0000',
      noKtp: newUserKtp.trim() || '3171000000000000',
      noSim: '990000000000',
      alamat: newUserAddress.trim() || 'DKI Jakarta',
    };

    onAddUser(user);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserKtp('');
    setNewUserAddress('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 mb-2">
            <Icons.Settings className="w-3.5 h-3.5" />
            <span>Hak Akses: {currentUser.role === 'admin' ? 'Administrator Penuh' : 'Petugas Rental'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Pusat Kendali Operasional Rental
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Kelola armada, verifikasi sewa peminjam, proses denda pengembalian, dan cetak laporan resmi UKK
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {currentUser.role === 'admin' && (
            <button
              onClick={onAddCarClick}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Icons.Plus className="w-4 h-4" />
              <span>Tambah Mobil Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Total Armada</span>
            <Icons.Car className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">
            {totalMobil} <span className="text-xs font-normal text-zinc-500">Unit</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Mobil Tersedia</span>
            <Icons.CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {mobilTersedia} <span className="text-xs font-normal text-zinc-500">Siap</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Sedang Disewa</span>
            <Icons.Key className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400">
            {mobilDisewa} <span className="text-xs font-normal text-zinc-500">Jalan</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Total Transaksi</span>
            <Icons.FileText className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">
            {totalTrx} <span className="text-xs font-normal text-zinc-500">Order</span>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white shadow-md">
          <div className="flex items-center justify-between text-blue-100">
            <span className="text-xs font-medium">Kas Diterima (Lunas)</span>
            <Icons.Shield className="w-4 h-4 text-blue-200" />
          </div>
          <div className="mt-2 text-lg sm:text-xl font-black">
            {formatRupiah(totalPendapatan)}
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('transaksi')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeSubTab === 'transaksi'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Icons.FileText className="w-4 h-4" />
          <span>Kelola Transaksi Sewa ({transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('armada')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeSubTab === 'armada'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Icons.Car className="w-4 h-4" />
          <span>Manajemen Armada Mobil ({cars.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('laporan')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors ${
            activeSubTab === 'laporan'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Icons.Printer className="w-4 h-4" />
          <span>Laporan & Cetak Rekapitulasi UKK</span>
        </button>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveSubTab('users')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeSubTab === 'users'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Icons.Users className="w-4 h-4" />
            <span>Kelola Pengguna ({users.length})</span>
          </button>
        )}
      </div>

      {/* TAB 1: TRANSAKSI */}
      {activeSubTab === 'transaksi' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-900 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="relative flex-1 max-w-sm">
              <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={trxSearch}
                onChange={(e) => setTrxSearch(e.target.value)}
                placeholder="Cari kode TRX, peminjam, mobil, plat..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={trxFilterStatus}
                onChange={(e) => setTrxFilterStatus(e.target.value)}
                className="text-xs font-medium py-2 px-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
              >
                <option value="all">Semua Status Rental</option>
                <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
                <option value="dikonfirmasi">Dikonfirmasi (Siap)</option>
                <option value="sedang_disewa">Sedang Disewa (Aktif)</option>
                <option value="selesai">Selesai</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-bold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">No. Transaksi</th>
                    <th className="py-3 px-4">Pelanggan / Kontak</th>
                    <th className="py-3 px-4">Unit Mobil & Plat</th>
                    <th className="py-3 px-4">Jadwal Sewa</th>
                    <th className="py-3 px-4">Total Biaya</th>
                    <th className="py-3 px-4">Status Rental</th>
                    <th className="py-3 px-4 text-right">Aksi Petugas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-zinc-400">
                        Tidak ada transaksi ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((trx) => {
                      const statusBadge = getTransactionStatusBadge(trx.statusTransaksi);
                      const payBadge = getPaymentStatusBadge(trx.statusPembayaran);

                      return (
                        <tr
                          key={trx.id}
                          className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-white">
                            {trx.kodeTransaksi}
                            <span className="block text-[10px] font-sans font-normal text-zinc-400">
                              {formatDateIndo(trx.createdAt)}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-zinc-800 dark:text-zinc-200 block">
                              {trx.userName}
                            </span>
                            <span className="text-[11px] text-zinc-400 block">{trx.userPhone}</span>
                            <span className="text-[10px] text-zinc-500">NIK: {trx.userKtp}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                              {trx.carName}
                            </span>
                            <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">
                              {trx.carPlat}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-zinc-800 dark:text-zinc-200 block">
                              {formatDateIndo(trx.tglMulai)} s.d. {formatDateIndo(trx.tglSelesai)}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {trx.durasiHari} Hari {trx.opsiSupir ? '(+Supir)' : '(Lepas Kunci)'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-zinc-900 dark:text-white block">
                              {formatRupiah(trx.totalBiayaAkhir || trx.totalBiaya)}
                            </span>
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${payBadge.bg}`}
                            >
                              {payBadge.label} ({trx.metodePembayaran})
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusBadge.bg}`}
                            >
                              {statusBadge.label}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* If Pending: Confirm or Cancel */}
                              {trx.statusTransaksi === 'menunggu_konfirmasi' && (
                                <>
                                  <button
                                    onClick={() =>
                                      onUpdateTransactionStatus(trx.id, 'dikonfirmasi')
                                    }
                                    title="Setujui Pesanan"
                                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors"
                                  >
                                    Konfirmasi
                                  </button>
                                  <button
                                    onClick={() =>
                                      onUpdateTransactionStatus(trx.id, 'dibatalkan', trx.carId)
                                    }
                                    title="Tolak / Batalkan"
                                    className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-semibold"
                                  >
                                    Tolak
                                  </button>
                                </>
                              )}

                              {/* If Confirmed: Handover Keys / Start Rental */}
                              {trx.statusTransaksi === 'dikonfirmasi' && (
                                <button
                                  onClick={() =>
                                    onUpdateTransactionStatus(trx.id, 'sedang_disewa', trx.carId)
                                  }
                                  title="Serahkan Kunci Mobil ke Peminjam"
                                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                                >
                                  <Icons.Key className="w-3 h-3" />
                                  <span>Serah Kunci</span>
                                </button>
                              )}

                              {/* If Sedang Disewa: Process Return (with automatic late calculation!) */}
                              {trx.statusTransaksi === 'sedang_disewa' && (
                                <button
                                  onClick={() => onOpenReturnModal(trx)}
                                  title="Proses Pengembalian Unit Mobil"
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                                >
                                  <Icons.CheckCircle className="w-3 h-3" />
                                  <span>Pengembalian</span>
                                </button>
                              )}

                              {/* Print Invoice Button */}
                              <button
                                onClick={() => onViewInvoice(trx)}
                                title="Cetak Nota Kuitansi"
                                className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                              >
                                <Icons.Printer className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARMADA MOBIL (CRUD) */}
      {activeSubTab === 'armada' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-900 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="relative flex-1 max-w-sm">
              <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={carSearch}
                onChange={(e) => setCarSearch(e.target.value)}
                placeholder="Cari armada, merk, nomor plat..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={carStatusFilter}
                onChange={(e) => setCarStatusFilter(e.target.value)}
                className="text-xs font-medium py-2 px-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
              >
                <option value="all">Semua Status Ketersediaan</option>
                <option value="tersedia">Tersedia</option>
                <option value="disewa">Sedang Disewa</option>
                <option value="perbaikan">Perbaikan</option>
              </select>

              {currentUser.role === 'admin' && (
                <button
                  onClick={onAddCarClick}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                >
                  <Icons.Plus className="w-4 h-4" />
                  <span>Tambah Mobil</span>
                </button>
              )}
            </div>
          </div>

          {/* Cars Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-bold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Mobil & Foto</th>
                    <th className="py-3 px-4">Plat Nomor</th>
                    <th className="py-3 px-4">Kategori / Spesifikasi</th>
                    <th className="py-3 px-4">Tarif Sewa / Hari</th>
                    <th className="py-3 px-4">Status Armada</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredCars.map((car) => {
                    const badge = getCarStatusBadge(car.status);

                    return (
                      <tr
                        key={car.id}
                        className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={car.gambar}
                              alt={car.nama}
                              className="w-14 h-10 object-cover rounded-lg bg-zinc-100 border border-zinc-200 dark:border-zinc-700"
                            />
                            <div>
                              <span className="font-bold text-zinc-900 dark:text-white block">
                                {car.nama}
                              </span>
                              <span className="text-[11px] text-zinc-400">
                                {car.merk} &bull; Thn {car.tahun}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-zinc-950 text-white tracking-wider border border-zinc-700">
                            {car.platNomor}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                            {car.kategori}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {car.kapasitas} Kursi &bull; {car.transmisi} &bull; {car.bahanBakar}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">
                          {formatRupiah(car.hargaPerHari)}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${badge.bg}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                              {badge.label}
                            </span>

                            {/* Fast status switcher */}
                            <select
                              value={car.status}
                              onChange={(e) =>
                                onUpdateCarStatus(car.id, e.target.value as CarStatus)
                              }
                              className="text-[10px] font-semibold py-1 px-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                            >
                              <option value="tersedia">Tersedia</option>
                              <option value="disewa">Disewa</option>
                              <option value="perbaikan">Perbaikan</option>
                            </select>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onEditCarClick(car)}
                              title="Edit Data Mobil"
                              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                            >
                              <Icons.Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {currentUser.role === 'admin' && (
                              <button
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Apakah Anda yakin ingin menghapus unit mobil ${car.nama} (${car.platNomor})?`
                                    )
                                  ) {
                                    onDeleteCar(car.id);
                                  }
                                }}
                                title="Hapus Mobil"
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 transition-colors"
                              >
                                <Icons.Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LAPORAN RENTAL UKK */}
      {activeSubTab === 'laporan' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Filter Rekapitulasi Laporan Transaksi Sewa Mobil
              </h3>
              <p className="text-xs text-zinc-500">
                Pilih rentang tanggal untuk merekapitulasi data transaksi rental dan mencetak berkas laporan resmi
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Mulai Tanggal
                </label>
                <input
                  type="date"
                  value={reportStartDate}
                  onChange={(e) => setReportStartDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={(e) => setReportEndDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Filter Status
                </label>
                <select
                  value={reportStatus}
                  onChange={(e) => setReportStatus(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                >
                  <option value="all">Semua Status</option>
                  <option value="selesai">Selesai (Sudah Kembali)</option>
                  <option value="sedang_disewa">Sedang Disewa (Aktif)</option>
                  <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
                </select>
              </div>

              <div>
                <button
                  onClick={() =>
                    onPrintReport(reportTransactions, reportStartDate, reportEndDate)
                  }
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
                >
                  <Icons.Printer className="w-4 h-4" />
                  <span>Cetak / Print Laporan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Report Financial Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs text-zinc-500 block">Total Transaksi Sesuai Filter</span>
              <div className="text-xl font-black text-zinc-900 dark:text-white mt-1">
                {reportTransactions.length} Transaksi
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs text-zinc-500 block">Total Pendapatan Terverifikasi</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {formatRupiah(reportTotalRevenue)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs text-zinc-500 block">Periode Laporan</span>
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-2">
                {formatDateIndo(reportStartDate)} s.d. {formatDateIndo(reportEndDate)}
              </div>
            </div>
          </div>

          {/* Table Preview */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                Pratinjau Data Laporan
              </h4>
              <span className="text-xs text-zinc-400">{reportTransactions.length} Data</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-bold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">No. TRX</th>
                    <th className="py-2.5 px-4">Penyewa</th>
                    <th className="py-2.5 px-4">Armada Mobil</th>
                    <th className="py-2.5 px-4">Periode</th>
                    <th className="py-2.5 px-4">Total Biaya</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {reportTransactions.map((trx) => (
                    <tr key={trx.id}>
                      <td className="py-2.5 px-4 font-mono font-bold">{trx.kodeTransaksi}</td>
                      <td className="py-2.5 px-4">{trx.userName}</td>
                      <td className="py-2.5 px-4">
                        {trx.carName} ({trx.carPlat})
                      </td>
                      <td className="py-2.5 px-4">
                        {formatDateIndo(trx.tglMulai)} - {formatDateIndo(trx.tglSelesai)}
                      </td>
                      <td className="py-2.5 px-4 font-bold">
                        {formatRupiah(trx.totalBiayaAkhir || trx.totalBiaya)}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                          {trx.statusTransaksi}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USERS (Admin Only) */}
      {activeSubTab === 'users' && currentUser.role === 'admin' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Daftar Pengguna Sistem Rental
              </h3>
              <p className="text-xs text-zinc-500">
                Kelola hak akses administrator, staf petugas lapangan, dan akun pelanggan
              </p>
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Icons.Plus className="w-4 h-4" />
              <span>Tambah Petugas / Pelanggan</span>
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-bold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Peran (Role)</th>
                  <th className="py-3 px-4">Nomor HP</th>
                  <th className="py-3 px-4">NIK KTP</th>
                  <th className="py-3 px-4">Alamat Domisili</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white">{u.nama}</td>
                    <td className="py-3 px-4 text-zinc-500">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : u.role === 'petugas'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{u.noHp}</td>
                    <td className="py-3 px-4 font-mono text-zinc-500">{u.noKtp}</td>
                    <td className="py-3 px-4 text-zinc-500 max-w-xs truncate">{u.alamat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Tambah Akun Baru
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Nama petugas / pelanggan"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Akun *
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Hak Akses (Role)
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                >
                  <option value="petugas">Petugas (Operator Rental)</option>
                  <option value="pelanggan">Pelanggan (Penyewa)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  NIK KTP
                </label>
                <input
                  type="text"
                  value={newUserKtp}
                  onChange={(e) => setNewUserKtp(e.target.value)}
                  placeholder="3171xxxxxxxxxxxx"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  value={newUserAddress}
                  onChange={(e) => setNewUserAddress(e.target.value)}
                  placeholder="Alamat domisili"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-1.5 text-zinc-500 hover:text-zinc-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
