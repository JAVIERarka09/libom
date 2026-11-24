'use client';

import React, { useState } from 'react';
import { Transaction, User } from '../lib/types';
import {
  formatDateIndo,
  formatRupiah,
  getPaymentStatusBadge,
  getTransactionStatusBadge,
} from '../lib/format';
import { Icons } from './Icons';

interface CustomerHistoryProps {
  currentUser: User;
  transactions: Transaction[];
  onViewInvoice: (transaction: Transaction) => void;
  onExploreCars: () => void;
}

export const CustomerHistory: React.FC<CustomerHistoryProps> = ({
  currentUser,
  transactions,
  onViewInvoice,
  onExploreCars,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter only transactions belonging to the current customer
  const customerTransactions = transactions.filter((t) => t.userId === currentUser.id);

  const filtered = customerTransactions.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.statusTransaksi === filterStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & User Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <Icons.User className="w-3.5 h-3.5" />
            <span>Akun Pelanggan: {currentUser.nama}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Riwayat Rental & Pemesanan Saya
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Pantau status pesanan sewa mobil Anda dan unduh invoice kuitansi pembayaran resmi
          </p>
        </div>

        <button
          onClick={onExploreCars}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>Sewa Mobil Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'all', label: 'Semua Pesanan' },
          { key: 'menunggu_konfirmasi', label: 'Menunggu Verifikasi' },
          { key: 'dikonfirmasi', label: 'Siap Diambil' },
          { key: 'sedang_disewa', label: 'Sedang Berjalan' },
          { key: 'selesai', label: 'Selesai' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === tab.key
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 mt-8">
          <Icons.FileText className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
            Belum ada riwayat transaksi rental
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Anda belum melakukan pemesanan sewa mobil dengan kriteria ini. Jelajahi katalog armada kami sekarang.
          </p>
          <button
            onClick={onExploreCars}
            className="mt-5 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Eksplorasi Katalog Mobil
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((trx) => {
            const statusBadge = getTransactionStatusBadge(trx.statusTransaksi);
            const payBadge = getPaymentStatusBadge(trx.statusPembayaran);

            return (
              <div
                key={trx.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  
                  {/* Left: Code & Date */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                      TRX
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
                          {trx.kodeTransaksi}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          &bull; Diajukan {formatDateIndo(trx.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Metode: <strong className="text-zinc-700 dark:text-zinc-300">{trx.metodePembayaran}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Right: Badges */}
                  <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${statusBadge.bg}`}
                    >
                      {statusBadge.label}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${payBadge.bg}`}
                    >
                      Pembayaran: {payBadge.label}
                    </span>
                  </div>
                </div>

                {/* Car and Rent Details */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* Car Info */}
                  <div className="md:col-span-6 flex items-center gap-3">
                    {trx.carImage && (
                      <img
                        src={trx.carImage}
                        alt={trx.carName}
                        className="w-16 h-12 object-cover rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                      />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {trx.carName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {trx.carPlat}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {formatRupiah(trx.carPricePerDay)} / hari
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rental Period */}
                  <div className="md:col-span-3 text-xs">
                    <span className="text-[10px] text-zinc-400 block font-medium">Periode Sewa</span>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                      {formatDateIndo(trx.tglMulai)} s.d. {formatDateIndo(trx.tglSelesai)}
                    </div>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                      Durasi: {trx.durasiHari} Hari
                    </span>
                  </div>

                  {/* Cost & Action */}
                  <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-zinc-400 block">Total Biaya</span>
                      <span className="text-sm sm:text-base font-extrabold text-blue-600 dark:text-blue-400">
                        {formatRupiah(trx.totalBiayaAkhir || trx.totalBiaya)}
                      </span>
                    </div>

                    <button
                      onClick={() => onViewInvoice(trx)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 transition-colors"
                      title="Lihat & Cetak Nota Invoice"
                    >
                      <Icons.Printer className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Nota / Kuitansi</span>
                    </button>
                  </div>
                </div>

                {/* Overdue Alert banner if any */}
                {trx.hariTerlambat && trx.hariTerlambat > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-700 dark:text-rose-300 flex items-center justify-between">
                    <span>
                      Dikembalikan terlambat <strong>{trx.hariTerlambat} hari</strong>. Dikenakan denda keterlambatan: <strong>{formatRupiah(trx.totalDenda || 0)}</strong>.
                    </span>
                    <span className="font-semibold">Selesai & Lunas</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
