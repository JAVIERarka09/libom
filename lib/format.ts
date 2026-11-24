import { CarStatus, PaymentStatus, TransactionStatus } from './types';

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDateIndo = (dateStr?: string): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const getCarStatusBadge = (status: CarStatus) => {
  switch (status) {
    case 'tersedia':
      return {
        label: 'Tersedia',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800',
        dot: 'bg-emerald-500',
      };
    case 'disewa':
      return {
        label: 'Sedang Disewa',
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800',
        dot: 'bg-amber-500',
      };
    case 'perbaikan':
      return {
        label: 'Perbaikan / Bengkel',
        bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800',
        dot: 'bg-rose-500',
      };
    default:
      return {
        label: status,
        bg: 'bg-gray-100 text-gray-700 border-gray-200',
        dot: 'bg-gray-400',
      };
  }
};

export const getTransactionStatusBadge = (status: TransactionStatus) => {
  switch (status) {
    case 'menunggu_konfirmasi':
      return {
        label: 'Menunggu Konfirmasi',
        bg: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800',
      };
    case 'dikonfirmasi':
      return {
        label: 'Dikonfirmasi (Siap Ambil)',
        bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800',
      };
    case 'sedang_disewa':
      return {
        label: 'Sedang Disewa',
        bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800',
      };
    case 'selesai':
      return {
        label: 'Selesai (Dikembalikan)',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800',
      };
    case 'dibatalkan':
      return {
        label: 'Dibatalkan',
        bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800',
      };
    default:
      return {
        label: status,
        bg: 'bg-gray-100 text-gray-700 border-gray-200',
      };
  }
};

export const getPaymentStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case 'lunas':
      return {
        label: 'Lunas',
        bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      };
    case 'menunggu_verifikasi':
      return {
        label: 'Verifikasi',
        bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      };
    case 'belum_bayar':
      return {
        label: 'Belum Bayar',
        bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      };
    default:
      return {
        label: status,
        bg: 'bg-gray-100 text-gray-700',
      };
  }
};

export const hitungDurasiHari = (startStr: string, endStr: string): number => {
  if (!startStr || !endStr) return 1;
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

export const hitungKeterlambatan = (tglHarusKembali: string, tglAktual: string): number => {
  const harus = new Date(tglHarusKembali);
  const aktual = new Date(tglAktual);
  
  // Set to midnight for accurate day comparison
  harus.setHours(0, 0, 0, 0);
  aktual.setHours(0, 0, 0, 0);
  
  const diffTime = aktual.getTime() - harus.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};
