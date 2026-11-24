'use client';

import React, { useState, useEffect } from 'react';
import { Car, PaymentMethod, Transaction, User } from '../lib/types';
import { formatRupiah, getCarStatusBadge, hitungDurasiHari } from '../lib/format';
import { Icons } from './Icons';

interface CarDetailModalProps {
  car: Car | null;
  onClose: () => void;
  currentUser: User;
  onBookingSuccess: (transaction: Transaction) => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  onClose,
  currentUser,
  onBookingSuccess,
}) => {
  if (!car) return null;

  const isAvailable = car.status === 'tersedia';
  const badge = getCarStatusBadge(car.status);

  // Form states
  const todayStr = '2026-11-24';
  const tomorrowStr = '2026-11-25';

  const [tglMulai, setTglMulai] = useState(todayStr);
  const [tglSelesai, setTglSelesai] = useState(tomorrowStr);
  const [opsiSupir, setOpsiSupir] = useState(false);
  const [opsiAsuransi, setOpsiAsuransi] = useState(true);
  const [metodePembayaran, setMetodePembayaran] = useState<PaymentMethod>('BCA');

  // Customer info fields
  const [namaPenyewa, setNamaPenyewa] = useState(currentUser.nama || '');
  const [noHp, setNoHp] = useState(currentUser.noHp || '');
  const [noKtp, setNoKtp] = useState(currentUser.noKtp || '');
  const [noSim, setNoSim] = useState(currentUser.noSim || '');
  const [alamat, setAlamat] = useState(currentUser.alamat || '');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update whenever currentUser changes
  useEffect(() => {
    setNamaPenyewa(currentUser.nama || '');
    setNoHp(currentUser.noHp || '');
    setNoKtp(currentUser.noKtp || '');
    setNoSim(currentUser.noSim || '');
    setAlamat(currentUser.alamat || '');
  }, [currentUser]);

  // Calculations
  const durasiHari = hitungDurasiHari(tglMulai, tglSelesai);
  const TARIF_SUPIR_PER_HARI = 150000;
  const TARIF_ASURANSI_PER_HARI = 50000;

  const biayaSewaMobil = durasiHari * car.hargaPerHari;
  const biayaSupir = opsiSupir ? durasiHari * TARIF_SUPIR_PER_HARI : 0;
  const biayaAsuransi = opsiAsuransi ? durasiHari * TARIF_ASURANSI_PER_HARI : 0;
  const totalBiaya = biayaSewaMobil + biayaSupir + biayaAsuransi;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!namaPenyewa.trim()) {
      setFormError('Nama lengkap penyewa wajib diisi.');
      return;
    }
    if (!noHp.trim()) {
      setFormError('Nomor WhatsApp / HP wajib diisi.');
      return;
    }
    if (!noKtp.trim()) {
      setFormError('Nomor KTP / NIK wajib diisi untuk verifikasi sewa.');
      return;
    }
    if (!alamat.trim()) {
      setFormError('Alamat tempat tinggal wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newTransaction: Transaction = {
      id: `trx-${Date.now()}`,
      kodeTransaksi: `TRX-${tglMulai.replace(/-/g, '')}-${randomSuffix}`,
      userId: currentUser.id,
      userName: namaPenyewa,
      userPhone: noHp,
      userKtp: noKtp,
      userSim: noSim,
      userAddress: alamat,
      carId: car.id,
      carName: car.nama,
      carPlat: car.platNomor,
      carImage: car.gambar,
      carPricePerDay: car.hargaPerHari,
      tglMulai,
      tglSelesai,
      durasiHari,
      opsiSupir,
      opsiAsuransi,
      biayaSewaMobil,
      biayaSupir,
      biayaAsuransi,
      totalBiaya,
      metodePembayaran,
      statusPembayaran: metodePembayaran === 'Tunai' ? 'belum_bayar' : 'menunggu_verifikasi',
      statusTransaksi: 'menunggu_konfirmasi',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onBookingSuccess(newTransaction);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Close */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Icons.Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {isAvailable ? 'Form Pemesanan & Detail Unit' : 'Detail Spesifikasi Unit Mobil'}
              </h2>
              <p className="text-xs text-zinc-500">
                {car.merk} - {car.nama} ({car.platNomor})
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

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          
          {/* Top Car Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Image & Plate */}
            <div className="md:col-span-5 relative rounded-2xl overflow-hidden aspect-[16/11] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <img
                src={car.gambar}
                alt={car.nama}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border backdrop-blur-md ${badge.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                  {badge.label}
                </span>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1 rounded-md bg-black/80 text-white font-mono font-bold text-xs border border-zinc-700 tracking-wider">
                  {car.platNomor}
                </span>
              </div>
            </div>

            {/* Spec & Description */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Kategori {car.kategori}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">&bull; Tahun {car.tahun}</span>
                </div>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mt-1">
                  {car.nama}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {car.deskripsi}
                </p>

                {/* Spec Badges */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-center">
                    <span className="text-[10px] text-zinc-400 block font-medium">Kapasitas</span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {car.kapasitas} Kursi
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-center">
                    <span className="text-[10px] text-zinc-400 block font-medium">Transmisi</span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {car.transmisi}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-center">
                    <span className="text-[10px] text-zinc-400 block font-medium">Bahan Bakar</span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {car.bahanBakar}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-center">
                    <span className="text-[10px] text-zinc-400 block font-medium">Tarif Sewa</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {formatRupiah(car.hargaPerHari)}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                    Fasilitas & Kelengkapan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {car.fitur.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        <Icons.Check className="w-3 h-3 text-emerald-500" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* If Not Available */}
          {!isAvailable && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-3">
              <Icons.AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                  Unit Kendaraan Sedang Tidak Dapat Dipesan
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300/90 mt-0.5">
                  Mobil ini saat ini berstatus <strong>{badge.label}</strong>. Silakan pilih armada lain yang berstatus &quot;Tersedia&quot; pada katalog utama.
                </p>
              </div>
            </div>
          )}

          {/* Booking Form (If Available) */}
          {isAvailable && (
            <form onSubmit={handleSubmitBooking} className="space-y-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Icons.Calendar className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Lengkapi Data Pemesanan Rental
                </h4>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium">
                  {formError}
                </div>
              )}

              {/* Date Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Tanggal Mulai Sewa
                  </label>
                  <input
                    type="date"
                    value={tglMulai}
                    min="2026-11-24"
                    onChange={(e) => setTglMulai(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Tanggal Selesai Sewa
                  </label>
                  <input
                    type="date"
                    value={tglSelesai}
                    min={tglMulai}
                    onChange={(e) => setTglSelesai(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Total Durasi Sewa
                  </label>
                  <div className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs sm:text-sm flex items-center justify-between">
                    <span>{durasiHari} Hari Penuh</span>
                    <Icons.Clock className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Add-ons (Driver & Insurance) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="checkbox"
                    checked={opsiSupir}
                    onChange={(e) => setOpsiSupir(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-zinc-300 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-zinc-900 dark:text-white block">
                      Pakai Jasa Supir (+Rp 150.000 / hari)
                    </span>
                    <span className="text-zinc-500">
                      Bebas lelah, disetir oleh driver profesional berlisensi resmi.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="checkbox"
                    checked={opsiAsuransi}
                    onChange={(e) => setOpsiAsuransi(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-zinc-300 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-zinc-900 dark:text-white block">
                      Proteksi Asuransi All-Risk (+Rp 50.000 / hari)
                    </span>
                    <span className="text-zinc-500">
                      Perlindungan dari risiko baret, lecet, dan insiden tak terduga.
                    </span>
                  </div>
                </label>
              </div>

              {/* Customer Identitas Form */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-4">
                <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                  Data Identitas Penyewa (Syarat UKK)
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={namaPenyewa}
                      onChange={(e) => setNamaPenyewa(e.target.value)}
                      required
                      placeholder="Nama sesuai KTP"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Nomor WhatsApp / Telp *
                    </label>
                    <input
                      type="text"
                      value={noHp}
                      onChange={(e) => setNoHp(e.target.value)}
                      required
                      placeholder="0812-xxxx-xxxx"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Nomor KTP / NIK *
                    </label>
                    <input
                      type="text"
                      value={noKtp}
                      onChange={(e) => setNoKtp(e.target.value)}
                      required
                      placeholder="16 Digit NIK KTP"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Nomor SIM A (Wajib jika lepas kunci)
                    </label>
                    <input
                      type="text"
                      value={noSim}
                      onChange={(e) => setNoSim(e.target.value)}
                      placeholder="Nomor SIM Pengemudi"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Alamat Domisili Lengkap *
                    </label>
                    <textarea
                      rows={2}
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      required
                      placeholder="Alamat rumah / domisili penyewa"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2 uppercase tracking-wider">
                  Pilih Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['BCA', 'Mandiri', 'BRI', 'QRIS', 'Tunai'] as PaymentMethod[]).map((metode) => (
                    <button
                      type="button"
                      key={metode}
                      onClick={() => setMetodePembayaran(metode)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        metodePembayaran === metode
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {metode === 'Tunai' ? 'Tunai / Cash' : metode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Calculation Summary */}
              <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-2.5">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span>Biaya Sewa Unit ({durasiHari} Hari x {formatRupiah(car.hargaPerHari)})</span>
                  <span className="font-semibold">{formatRupiah(biayaSewaMobil)}</span>
                </div>
                {opsiSupir && (
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span>Biaya Supir ({durasiHari} Hari x Rp 150.000)</span>
                    <span className="font-semibold">{formatRupiah(biayaSupir)}</span>
                  </div>
                )}
                {opsiAsuransi && (
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span>Biaya Asuransi All-Risk ({durasiHari} Hari x Rp 50.000)</span>
                    <span className="font-semibold">{formatRupiah(biayaAsuransi)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-zinc-700 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400 block">Total Biaya Rental</span>
                    <span className="text-lg font-black text-blue-400">
                      {formatRupiah(totalBiaya)}
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-zinc-400">
                    <span>Metode: <strong className="text-white">{metodePembayaran}</strong></span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-50"
                >
                  <Icons.CheckCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Memproses Transaksi...' : 'Konfirmasi & Ajukan Sewa'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
