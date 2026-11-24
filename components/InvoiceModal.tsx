'use client';

import React from 'react';
import { Transaction } from '../lib/types';
import { formatDateIndo, formatRupiah, getPaymentStatusBadge } from '../lib/format';
import { Icons } from './Icons';

interface InvoiceModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const payBadge = getPaymentStatusBadge(transaction.statusPembayaran);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white text-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar (Hidden during print) */}
        <div className="print:hidden flex items-center justify-between p-4 bg-zinc-900 text-white border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Icons.Printer className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Pratinjau Nota Kuitansi Sewa Mobil
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Icons.Printer className="w-3.5 h-3.5" />
              <span>Cetak Kuitansi</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div className="p-8 sm:p-10 space-y-6 bg-white text-zinc-900 font-sans text-xs">
          
          {/* Header Kop Surat */}
          <div className="flex items-start justify-between border-b-2 border-zinc-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  A
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
                  AUTOLUXE RENT CAR
                </h1>
              </div>
              <p className="text-[11px] text-zinc-600 font-medium mt-1">
                Jasa Persewaan Mobil Terpercaya & Resmi &bull; Sertifikasi UKK RPL
              </p>
              <p className="text-[10px] text-zinc-500">
                Jl. Merdeka Raya No. 45, Jakarta | Telp: (021) 555-0199 | WhatsApp: 0812-8899-0011
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                BUKTI PEMBAYARAN / KUITANSI
              </span>
              <span className="font-mono text-base font-black text-blue-600">
                {transaction.kodeTransaksi}
              </span>
              <div className="mt-1">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    transaction.statusPembayaran === 'lunas'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {transaction.statusPembayaran === 'lunas' ? 'LUNAS / PAID' : 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          {/* Info Transaksi & Penyewa Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                Identitas Penyewa
              </span>
              <span className="text-xs font-bold text-zinc-900 block mt-0.5">
                {transaction.userName}
              </span>
              <span className="text-[11px] text-zinc-600 block">{transaction.userPhone}</span>
              <span className="text-[10px] text-zinc-500 block">KTP: {transaction.userKtp}</span>
              {transaction.userSim && (
                <span className="text-[10px] text-zinc-500 block">SIM: {transaction.userSim}</span>
              )}
            </div>

            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                Unit Kendaraan
              </span>
              <span className="text-xs font-bold text-zinc-900 block mt-0.5">
                {transaction.carName}
              </span>
              <span className="font-mono text-xs font-bold text-blue-600 block">
                {transaction.carPlat}
              </span>
              <span className="text-[11px] text-zinc-600 block">
                Tarif: {formatRupiah(transaction.carPricePerDay)} / hari
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                Periode Rental
              </span>
              <span className="text-xs font-bold text-zinc-900 block mt-0.5">
                {formatDateIndo(transaction.tglMulai)} s.d. {formatDateIndo(transaction.tglSelesai)}
              </span>
              <span className="text-[11px] text-zinc-600 block">
                Durasi Sewa: <strong>{transaction.durasiHari} Hari</strong>
              </span>
              <span className="text-[10px] text-zinc-500 block">
                Metode Bayar: <strong>{transaction.metodePembayaran}</strong>
              </span>
            </div>
          </div>

          {/* Rincian Biaya Table */}
          <div>
            <table className="w-full text-left text-xs border border-zinc-200">
              <thead className="bg-zinc-100 font-bold border-b border-zinc-200">
                <tr>
                  <th className="py-2.5 px-3">Deskripsi Layanan</th>
                  <th className="py-2.5 px-3 text-center">Durasi / Satuan</th>
                  <th className="py-2.5 px-3 text-right">Tarif Satuan</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                <tr>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-zinc-900 block">
                      Sewa Unit Mobil {transaction.carName}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Nomor Polisi: {transaction.carPlat}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">{transaction.durasiHari} Hari</td>
                  <td className="py-2.5 px-3 text-right">
                    {formatRupiah(transaction.carPricePerDay)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold">
                    {formatRupiah(transaction.biayaSewaMobil)}
                  </td>
                </tr>

                {transaction.opsiSupir && (
                  <tr>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-zinc-900 block">
                        Jasa Supir / Driver Profesional
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        Pendampingan perjalanan aman dan nyaman
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">{transaction.durasiHari} Hari</td>
                    <td className="py-2.5 px-3 text-right">Rp 150.000</td>
                    <td className="py-2.5 px-3 text-right font-semibold">
                      {formatRupiah(transaction.biayaSupir)}
                    </td>
                  </tr>
                )}

                {transaction.opsiAsuransi && (
                  <tr>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-zinc-900 block">
                        Proteksi Asuransi Kendaraan All-Risk
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        Perlindungan baret, lecet, dan risiko insiden
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">{transaction.durasiHari} Hari</td>
                    <td className="py-2.5 px-3 text-right">Rp 50.000</td>
                    <td className="py-2.5 px-3 text-right font-semibold">
                      {formatRupiah(transaction.biayaAsuransi)}
                    </td>
                  </tr>
                )}

                {/* Denda Keterlambatan if any */}
                {transaction.hariTerlambat && transaction.hariTerlambat > 0 ? (
                  <tr className="bg-rose-50/50">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-rose-700 block">
                        Denda Keterlambatan Pengembalian
                      </span>
                      <span className="text-[10px] text-rose-600">
                        Dikembalikan pada {formatDateIndo(transaction.tglPengembalianAktual)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-rose-700 font-bold">
                      {transaction.hariTerlambat} Hari Telat
                    </td>
                    <td className="py-2.5 px-3 text-right text-rose-700">
                      {formatRupiah(transaction.dendaPerHari || 100000)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-rose-700">
                      {formatRupiah(transaction.totalDenda || 0)}
                    </td>
                  </tr>
                ) : null}

                {/* Biaya Kerusakan if any */}
                {transaction.biayaKerusakan && transaction.biayaKerusakan > 0 ? (
                  <tr className="bg-amber-50/50">
                    <td className="py-2.5 px-3" colSpan={3}>
                      <span className="font-bold text-amber-800 block">
                        Biaya Penggantian Kerusakan / Perbaikan Fisik
                      </span>
                      <span className="text-[10px] text-amber-700">
                        Keterangan: {transaction.keteranganKondisi}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-800">
                      {formatRupiah(transaction.biayaKerusakan)}
                    </td>
                  </tr>
                ) : null}
              </tbody>
              <tfoot className="bg-zinc-50 border-t-2 border-zinc-300">
                <tr>
                  <td colSpan={3} className="py-3 px-3 text-right font-extrabold text-zinc-900 text-sm">
                    TOTAL AKHIR PEMBAYARAN:
                  </td>
                  <td className="py-3 px-3 text-right font-black text-blue-600 text-base">
                    {formatRupiah(transaction.totalBiayaAkhir || transaction.totalBiaya)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ketentuan Sewa */}
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-[10px] text-zinc-600 space-y-1">
            <span className="font-bold text-zinc-800 uppercase block">
              Ketentuan & Syarat Rental Mobil:
            </span>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Penyewa bertanggung jawab penuh menjaga kebersihan dan kelayakan kendaraan selama masa sewa.</li>
              <li>Keterlambatan pengembalian unit dikenakan denda keterlambatan sebesar Rp 100.000 per hari keterlambatan.</li>
              <li>Kuitansi ini merupakan bukti pembayaran sah dan perjanjian sewa menyewa yang mengikat.</li>
            </ul>
          </div>

          {/* Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 text-center text-xs">
            <div>
              <p className="text-zinc-500">Penyewa / Peminjam,</p>
              <div className="h-16" />
              <p className="font-bold text-zinc-900 border-t border-zinc-300 inline-block px-6 pt-1">
                ( {transaction.userName} )
              </p>
            </div>

            <div>
              <p className="text-zinc-500">Petugas Rental AUTOLUXE,</p>
              <div className="h-16" />
              <p className="font-bold text-zinc-900 border-t border-zinc-300 inline-block px-6 pt-1">
                ( {transaction.petugasProses || 'Rian Pratama (Petugas)'} )
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
