'use client';

import React, { useState } from 'react';
import { Transaction, User } from '../lib/types';
import { formatDateIndo, formatRupiah, hitungKeterlambatan } from '../lib/format';
import { Icons } from './Icons';

interface ReturnModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  currentUser: User;
  onConfirmReturn: (updatedTransaction: Transaction) => void;
}

export const ReturnModal: React.FC<ReturnModalProps> = ({
  transaction,
  onClose,
  currentUser,
  onConfirmReturn,
}) => {
  if (!transaction) return null;

  const todayStr = '2026-11-24';
  const [tglAktual, setTglAktual] = useState(todayStr);
  const [dendaPerHari] = useState(100000); // Rp 100.000 / hari terlambat
  const [biayaKerusakan, setBiayaKerusakan] = useState<number>(0);
  const [kondisiFisik, setKondisiFisik] = useState('Baik, bersih, dan lengkap');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate late days
  const hariTerlambat = hitungKeterlambatan(transaction.tglSelesai, tglAktual);
  const totalDenda = hariTerlambat * dendaPerHari;
  const totalTambahan = totalDenda + Number(biayaKerusakan);
  const totalBiayaAkhir = transaction.totalBiaya + totalTambahan;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updated: Transaction = {
      ...transaction,
      tglPengembalianAktual: tglAktual,
      hariTerlambat,
      dendaPerHari,
      totalDenda,
      biayaKerusakan: Number(biayaKerusakan),
      keteranganKondisi: kondisiFisik,
      totalBiayaAkhir,
      statusTransaksi: 'selesai',
      statusPembayaran: 'lunas',
      petugasProses: currentUser.nama,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmReturn(updated);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Icons.Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Proses Pengembalian Armada Kendaraan
              </h3>
              <p className="text-xs text-zinc-500">
                Pemeriksaan fisik unit, hitung denda keterlambatan, dan serah terima kunci
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-zinc-400 block text-[10px] font-medium">No. Transaksi</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-white">
                {transaction.kodeTransaksi}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] font-medium">Penyewa</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate block">
                {transaction.userName}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] font-medium">Armada Mobil</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate block">
                {transaction.carName}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] font-medium">Plat Nomor</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {transaction.carPlat}
              </span>
            </div>
          </div>

          {/* Schedule vs Actual Return */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
              <span className="text-[11px] font-semibold text-zinc-500 block">Jadwal Selesai Sewa</span>
              <div className="text-sm font-bold text-zinc-900 dark:text-white mt-1">
                {formatDateIndo(transaction.tglSelesai)}
              </div>
              <span className="text-[10px] text-zinc-400">
                Durasi Pokok: {transaction.durasiHari} Hari
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Tanggal Pengembalian Aktual *
              </label>
              <input
                type="date"
                value={tglAktual}
                onChange={(e) => setTglAktual(e.target.value)}
                required
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
              />
            </div>
          </div>

          {/* Late Calculation Banner */}
          {hariTerlambat > 0 ? (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-2">
              <div className="flex items-center justify-between text-rose-800 dark:text-rose-200 font-bold text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Icons.AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>Keterlambatan Pengembalian Terdeteksi!</span>
                </div>
                <span>{hariTerlambat} Hari Telat</span>
              </div>
              <div className="text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between pt-2 border-t border-rose-200 dark:border-rose-800/80">
                <span>
                  Denda Keterlambatan ({hariTerlambat} Hari x {formatRupiah(dendaPerHari)})
                </span>
                <span className="font-extrabold text-sm text-rose-600 dark:text-rose-400">
                  + {formatRupiah(totalDenda)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <Icons.CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Unit dikembalikan tepat waktu tanpa denda keterlambatan.</span>
            </div>
          )}

          {/* Condition & Damage Check */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              Kondisi Fisik Kendaraan & Catatan Petugas
            </label>

            <div>
              <label className="block text-xs text-zinc-500 mb-1">
                Hasil Inspeksi Fisik (Bodi, Mesin, Kebersihan)
              </label>
              <input
                type="text"
                value={kondisiFisik}
                onChange={(e) => setKondisiFisik(e.target.value)}
                placeholder="Contoh: Bodi mulus, bensin penuh, interior bersih"
                required
                className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1">
                Biaya Kerusakan Tambahan (Jika ada baret/rusak, kosongkan jika tidak ada)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                  Rp
                </span>
                <input
                  type="number"
                  min={0}
                  step={50000}
                  value={biayaKerusakan}
                  onChange={(e) => setBiayaKerusakan(Number(e.target.value))}
                  placeholder="0"
                  className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Final Settlement Summary */}
          <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Biaya Sewa Pokok Transaksi:</span>
              <span>{formatRupiah(transaction.totalBiaya)}</span>
            </div>
            {hariTerlambat > 0 && (
              <div className="flex justify-between text-rose-300">
                <span>Denda Keterlambatan ({hariTerlambat} hari):</span>
                <span>+ {formatRupiah(totalDenda)}</span>
              </div>
            )}
            {biayaKerusakan > 0 && (
              <div className="flex justify-between text-amber-300">
                <span>Biaya Perbaikan / Kerusakan:</span>
                <span>+ {formatRupiah(biayaKerusakan)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-zinc-700 flex justify-between items-center text-sm">
              <span className="font-bold">Total Pembayaran Akhir:</span>
              <span className="font-black text-blue-400 text-base">
                {formatRupiah(totalBiayaAkhir)}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 text-right">
              Petugas Penerima: <strong className="text-white">{currentUser.nama}</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Icons.CheckCircle className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Menyimpan...'
                  : 'Konfirmasi Pengembalian & Set Mobil Tersedia'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
