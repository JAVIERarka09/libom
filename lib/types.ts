export type Role = 'admin' | 'petugas' | 'pelanggan';

export type CarStatus = 'tersedia' | 'disewa' | 'perbaikan';

export type CarCategory = 'MPV' | 'SUV' | 'Sedan' | 'City Car' | 'Luxury';

export type Transmission = 'Manual' | 'Matic';

export type FuelType = 'Bensin' | 'Diesel' | 'Hybrid' | 'Listrik';

export type TransactionStatus =
  | 'menunggu_konfirmasi'
  | 'dikonfirmasi'
  | 'sedang_disewa'
  | 'selesai'
  | 'dibatalkan';

export type PaymentStatus = 'belum_bayar' | 'menunggu_verifikasi' | 'lunas';

export type PaymentMethod = 'BCA' | 'Mandiri' | 'BRI' | 'QRIS' | 'Tunai';

export interface Car {
  id: string;
  nama: string;
  merk: string;
  platNomor: string;
  kategori: CarCategory;
  tahun: number;
  kapasitas: number;
  transmisi: Transmission;
  bahanBakar: FuelType;
  hargaPerHari: number;
  status: CarStatus;
  gambar: string;
  fitur: string[];
  deskripsi: string;
}

export interface User {
  id: string;
  nama: string;
  email: string;
  role: Role;
  noHp: string;
  noKtp: string;
  noSim: string;
  alamat: string;
}

export interface Transaction {
  id: string;
  kodeTransaksi: string;
  userId: string;
  userName: string;
  userPhone: string;
  userKtp: string;
  userSim?: string;
  userAddress?: string;
  carId: string;
  carName: string;
  carPlat: string;
  carImage?: string;
  carPricePerDay: number;
  tglMulai: string; // YYYY-MM-DD
  tglSelesai: string; // YYYY-MM-DD
  durasiHari: number;
  opsiSupir: boolean;
  opsiAsuransi: boolean;
  biayaSewaMobil: number;
  biayaSupir: number;
  biayaAsuransi: number;
  totalBiaya: number;
  metodePembayaran: PaymentMethod;
  statusPembayaran: PaymentStatus;
  statusTransaksi: TransactionStatus;
  tglPengembalianAktual?: string;
  hariTerlambat?: number;
  dendaPerHari?: number;
  totalDenda?: number;
  biayaKerusakan?: number;
  keteranganKondisi?: string;
  totalBiayaAkhir?: number;
  petugasProses?: string;
  createdAt: string;
}

export interface RentalReportFilter {
  startDate: string;
  endDate: string;
  status: string; // 'all' or specific TransactionStatus
}
