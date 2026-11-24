'use client';

import React from 'react';
import { Transaction } from '../lib/types';
import { formatDateIndo, formatRupiah } from '../lib/format';
import { Icons } from './Icons';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  startDate: string;
  endDate: string;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  startDate,
  endDate,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalPendapatan = transactions
    .filter((t) => t.statusPembayaran === 'lunas')
    .reduce((acc, curr) => acc + (curr.totalBiayaAkhir || curr.totalBiaya), 0);

  const totalDenda = transactions.reduce((acc, curr) => acc + (curr.totalDenda || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white text-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top bar (Hidden when printing) */}
        <div className="print:hidden flex items-center justify-between p-4 bg-zinc-900 text-white border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Icons.Printer className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Pratinjau Cetak Laporan Resmi UKK RPL
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Icons.Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT SHEET */}
        <div className="p-8 sm:p-12 space-y-6 bg-white text-zinc-900 font-sans text-xs">
          
          {/* Kop Surat Laporan UKK */}
          <div className="text-center border-b-2 border-zinc-900 pb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="font-bold tracking-widest text-xs uppercase text-zinc-600">
                UJI KOMPETENSI KEAHLIAN (UKK) REKAYASA PERANGKAT LUNAK &bull; PAKET A
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 uppercase tracking-tight">
              AUTOLUXE RENTAL CAR INDONESIA
            </h1>
            <p className="text-[11px] text-zinc-600">
              Sistem Manajemen & Informasi Persewaan Kendaraan Terpadu
            </p>
            <p className="text-[10px] text-zinc-500">
              Gedung AutoLuxe Center, Jl. Merdeka Raya No. 45 Jakarta Pusat | Telp: (021) 555-0199 | Email: info@autoluxe.id
            </p>
          </div>

          {/* Judul Dokumen */}
          <div className="text-center">
            <h2 className="text-sm font-bold uppercase underline tracking-wider text-zinc-900">
              LAPORAN REKAPITULASI TRANSAKSI PERSEWAAN MOBIL
            </h2>
            <p className="text-[11px] text-zinc-600 mt-0.5">
              Periode Laporan: <strong>{formatDateIndo(startDate)}</strong> s.d.{' '}
              <strong>{formatDateIndo(endDate)}</strong>
            </p>
          </div>

          {/* Ringkasan Eksekutif */}
          <div className="grid grid-cols-4 gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-300 text-center">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Total Transaksi</span>
              <span className="text-sm font-black text-zinc-900">{transactions.length} Order</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Denda Masuk</span>
              <span className="text-sm font-black text-rose-600">{formatRupiah(totalDenda)}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Status Lunas</span>
              <span className="text-sm font-black text-emerald-600">
                {transactions.filter((t) => t.statusPembayaran === 'lunas').length} Transaksi
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Total Kas Penerimaan</span>
              <span className="text-sm font-black text-blue-700">
                {formatRupiah(totalPendapatan)}
              </span>
            </div>
          </div>

          {/* Tabel Detail Transaksi */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border border-zinc-300">
              <thead className="bg-zinc-100 font-bold border-b border-zinc-300 text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-2.5 border-r border-zinc-300">No</th>
                  <th className="py-2 px-2.5 border-r border-zinc-300">Kode TRX</th>
                  <th className="py-2 px-2.5 border-r border-zinc-300">Peminjam / NIK</th>
                  <th className="py-2 px-2.5 border-r border-zinc-300">Mobil & Plat</th>
                  <th className="py-2 px-2.5 border-r border-zinc-300">Periode Sewa</th>
                  <th className="py-2 px-2.5 border-r border-zinc-300 text-center">Durasi</th>
                  <th className="py-2 px-2.5 border-r border-zinc-300 text-right">Denda</th>
                  <th className="py-2 px-2.5 border-r border-zinc-300 text-right">Total Akhir</th>
                  <th className="py-2 px-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-zinc-500">
                      Tidak ada transaksi pada periode ini.
                    </td>
                  </tr>
                ) : (
                  transactions.map((trx, idx) => (
                    <tr key={trx.id} className="hover:bg-zinc-50">
                      <td className="py-2 px-2.5 border-r border-zinc-200 text-center">{idx + 1}</td>
                      <td className="py-2 px-2.5 border-r border-zinc-200 font-mono font-bold">
                        {trx.kodeTransaksi}
                      </td>
                      <td className="py-2 px-2.5 border-r border-zinc-200">
                        <span className="font-bold block">{trx.userName}</span>
                        <span className="text-[9px] text-zinc-500">{trx.userKtp}</span>
                      </td>
                      <td className="py-2 px-2.5 border-r border-zinc-200">
                        <span className="block font-medium">{trx.carName}</span>
                        <span className="font-mono text-[9px] text-blue-600">{trx.carPlat}</span>
                      </td>
                      <td className="py-2 px-2.5 border-r border-zinc-200 text-[10px]">
                        {formatDateIndo(trx.tglMulai)} - {formatDateIndo(trx.tglSelesai)}
                      </td>
                      <td className="py-2 px-2.5 border-r border-zinc-200 text-center">
                        {trx.durasiHari} Hari
                      </td>
                      <td className="py-2 px-2.5 border-r border-zinc-200 text-right font-mono">
                        {trx.totalDenda && trx.totalDenda > 0 ? formatRupiah(trx.totalDenda) : '-'}
                      </td>
                      <td className="py-2 px-2.5 border-r border-zinc-200 text-right font-bold font-mono">
                        {formatRupiah(trx.totalBiayaAkhir || trx.totalBiaya)}
                      </td>
                      <td className="py-2 px-2.5 text-center text-[10px]">
                        <span className="font-bold capitalize">{trx.statusTransaksi.replace('_', ' ')}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-zinc-100 font-bold border-t-2 border-zinc-300">
                <tr>
                  <td colSpan={7} className="py-2.5 px-3 text-right uppercase">
                    Total Keseluruhan Penerimaan Kas:
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-blue-700">
                    {formatRupiah(totalPendapatan)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-[10px]">LUNAS</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Tanda Tangan Dokumen Resmi */}
          <div className="pt-8 grid grid-cols-2 text-center text-xs">
            <div>
              <p className="text-zinc-500">Mengetahui,</p>
              <p className="font-semibold text-zinc-800">Guru Pembimbing / Penguji UKK RPL</p>
              <div className="h-20" />
              <p className="font-bold text-zinc-900 border-t border-zinc-400 inline-block px-8 pt-1">
                ( .................................................. )
              </p>
            </div>

            <div>
              <p className="text-zinc-500">Jakarta, 24 November 2026</p>
              <p className="font-semibold text-zinc-800">Kepala Administrasi Rental Mobil</p>
              <div className="h-20" />
              <p className="font-bold text-zinc-900 border-t border-zinc-400 inline-block px-8 pt-1">
                ( Budi Santoso, S.Kom )
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
