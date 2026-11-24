'use client';

import React, { useState, useEffect } from 'react';
import { Car, CarCategory, CarStatus, FuelType, Transmission } from '../lib/types';
import { Icons } from './Icons';

interface CarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  carToEdit: Car | null;
  onSaveCar: (car: Car) => void;
}

export const CarFormModal: React.FC<CarFormModalProps> = ({
  isOpen,
  onClose,
  carToEdit,
  onSaveCar,
}) => {
  if (!isOpen) return null;

  const [nama, setNama] = useState('');
  const [merk, setMerk] = useState('');
  const [platNomor, setPlatNomor] = useState('');
  const [kategori, setKategori] = useState<CarCategory>('MPV');
  const [tahun, setTahun] = useState(2024);
  const [kapasitas, setKapasitas] = useState(7);
  const [transmisi, setTransmisi] = useState<Transmission>('Matic');
  const [bahanBakar, setBahanBakar] = useState<FuelType>('Bensin');
  const [hargaPerHari, setHargaPerHari] = useState(450000);
  const [status, setStatus] = useState<CarStatus>('tersedia');
  const [gambar, setGambar] = useState('');
  const [fiturInput, setFiturInput] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (carToEdit) {
      setNama(carToEdit.nama);
      setMerk(carToEdit.merk);
      setPlatNomor(carToEdit.platNomor);
      setKategori(carToEdit.kategori);
      setTahun(carToEdit.tahun);
      setKapasitas(carToEdit.kapasitas);
      setTransmisi(carToEdit.transmisi);
      setBahanBakar(carToEdit.bahanBakar);
      setHargaPerHari(carToEdit.hargaPerHari);
      setStatus(carToEdit.status);
      setGambar(carToEdit.gambar);
      setFiturInput(carToEdit.fitur.join(', '));
      setDeskripsi(carToEdit.deskripsi);
    } else {
      setNama('');
      setMerk('Toyota');
      setPlatNomor('B ');
      setKategori('MPV');
      setTahun(2024);
      setKapasitas(7);
      setTransmisi('Matic');
      setBahanBakar('Bensin');
      setHargaPerHari(450000);
      setStatus('tersedia');
      setGambar('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80');
      setFiturInput('AC Double Blower, Audio Bluetooth, Dual Airbags');
      setDeskripsi('');
    }
  }, [carToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nama.trim() || !merk.trim() || !platNomor.trim()) {
      setErrorMsg('Nama mobil, merk, dan plat nomor wajib diisi!');
      return;
    }

    if (hargaPerHari <= 0) {
      setErrorMsg('Harga sewa per hari harus lebih besar dari 0!');
      return;
    }

    const fiturArray = fiturInput
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const carData: Car = {
      id: carToEdit ? carToEdit.id : `car-${Date.now()}`,
      nama: nama.trim(),
      merk: merk.trim(),
      platNomor: platNomor.trim().toUpperCase(),
      kategori,
      tahun: Number(tahun),
      kapasitas: Number(kapasitas),
      transmisi,
      bahanBakar,
      hargaPerHari: Number(hargaPerHari),
      status,
      gambar: gambar.trim() || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      fitur: fiturArray.length > 0 ? fiturArray : ['AC Digital', 'Airbags', 'Audio System'],
      deskripsi: deskripsi.trim() || `${nama} armada rental terawat dan prima untuk perjalanan Anda.`,
    };

    onSaveCar(carData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Icons.Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {carToEdit ? 'Edit Data Armada Mobil' : 'Tambah Mobil Armada Baru'}
              </h3>
              <p className="text-xs text-zinc-500">
                Lengkapi spesifikasi unit mobil sesuai data riil armada
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Nama Model Mobil *
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Avanza Veloz"
                required
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Merk / Pabrikan *
              </label>
              <input
                type="text"
                value={merk}
                onChange={(e) => setMerk(e.target.value)}
                placeholder="Contoh: Toyota, Honda, Mitsubishi"
                required
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Nomor Plat Polisi *
              </label>
              <input
                type="text"
                value={platNomor}
                onChange={(e) => setPlatNomor(e.target.value.toUpperCase())}
                placeholder="Contoh: B 1234 ABC"
                required
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Kategori Kendaraan
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as CarCategory)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                <option value="MPV">MPV (Keluarga)</option>
                <option value="SUV">SUV (Tangguh)</option>
                <option value="Sedan">Sedan (Eksekutif)</option>
                <option value="City Car">City Car (Lincah & Irit)</option>
                <option value="Luxury">Luxury (Mewah / VIP)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Tahun Pembuatan
              </label>
              <input
                type="number"
                min={2015}
                max={2027}
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Kapasitas Penumpang (Kursi)
              </label>
              <input
                type="number"
                min={2}
                max={20}
                value={kapasitas}
                onChange={(e) => setKapasitas(Number(e.target.value))}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Transmisi
              </label>
              <select
                value={transmisi}
                onChange={(e) => setTransmisi(e.target.value as Transmission)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                <option value="Matic">Matic (Otomatis)</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Bahan Bakar
              </label>
              <select
                value={bahanBakar}
                onChange={(e) => setBahanBakar(e.target.value as FuelType)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                <option value="Bensin">Bensin</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Listrik">Listrik (EV)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Tarif Sewa per Hari (Rp) *
              </label>
              <input
                type="number"
                step={25000}
                min={100000}
                value={hargaPerHari}
                onChange={(e) => setHargaPerHari(Number(e.target.value))}
                required
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Status Ketersediaan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CarStatus)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                <option value="tersedia">Tersedia (Siap Sewa)</option>
                <option value="disewa">Sedang Disewa</option>
                <option value="perbaikan">Perbaikan / Bengkel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              URL Foto / Gambar Mobil
            </label>
            <input
              type="url"
              value={gambar}
              onChange={(e) => setGambar(e.target.value)}
              placeholder="https://..."
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Daftar Fitur (Pisahkan dengan tanda koma)
            </label>
            <input
              type="text"
              value={fiturInput}
              onChange={(e) => setFiturInput(e.target.value)}
              placeholder="Contoh: AC Double Blower, Bluetooth, Sensor Parkir, Kamera 360"
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Deskripsi Singkat Kendaraan
            </label>
            <textarea
              rows={2}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Keterangan kondisi kendaraan dan kelebihannya..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Icons.Check className="w-4 h-4" />
              <span>{carToEdit ? 'Simpan Perubahan' : 'Tambahkan Unit Mobil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
