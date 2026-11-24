'use client';

import React, { useState } from 'react';
import { Car, CarCategory, Transmission } from '../lib/types';
import { formatRupiah, getCarStatusBadge } from '../lib/format';
import { Icons } from './Icons';

interface CarCatalogProps {
  cars: Car[];
  onSelectCar: (car: Car) => void;
}

const CATEGORIES: (CarCategory | 'Semua')[] = ['Semua', 'MPV', 'SUV', 'Sedan', 'City Car', 'Luxury'];

export const CarCatalog: React.FC<CarCatalogProps> = ({ cars, onSelectCar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | 'Semua'>('Semua');
  const [selectedTransmission, setSelectedTransmission] = useState<Transmission | 'Semua'>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<'Semua' | 'tersedia' | 'disewa'>('Semua');
  const [sortBy, setSortBy] = useState<'termurah' | 'termahal' | 'kapasitas'>('termurah');

  // Filter logic
  const filteredCars = cars
    .filter((car) => {
      const matchSearch =
        car.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.platNomor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedCategory === 'Semua' || car.kategori === selectedCategory;
      const matchTransmission =
        selectedTransmission === 'Semua' || car.transmisi === selectedTransmission;
      const matchStatus = selectedStatus === 'Semua' || car.status === selectedStatus;

      return matchSearch && matchCategory && matchTransmission && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'termurah') return a.hargaPerHari - b.hargaPerHari;
      if (sortBy === 'termahal') return b.hargaPerHari - a.hargaPerHari;
      if (sortBy === 'kapasitas') return b.kapasitas - a.kapasitas;
      return 0;
    });

  return (
    <div id="katalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Katalog Armada Rental
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Pilih unit kendaraan sesuai kapasitas rombongan dan kebutuhan perjalanan Anda
          </p>
        </div>

        {/* Counter Badge */}
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 self-start md:self-auto">
          Menampilkan <span className="text-blue-600 font-bold">{filteredCars.length}</span> dari {cars.length} Mobil
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mt-6 bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari merk, model, atau plat nomor mobil..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <Icons.X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dropdown Filters (Transmisi, Status, Urutan) */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedTransmission}
            onChange={(e) => setSelectedTransmission(e.target.value as any)}
            className="text-xs font-medium py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Semua">Transmisi (Semua)</option>
            <option value="Matic">Matic</option>
            <option value="Manual">Manual</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="text-xs font-medium py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Semua">Status (Semua)</option>
            <option value="tersedia">Hanya Tersedia</option>
            <option value="disewa">Sedang Disewa</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-medium py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="termurah">Tarif: Termurah</option>
            <option value="termahal">Tarif: Termahal</option>
            <option value="kapasitas">Kapasitas Kursi</option>
          </select>
        </div>
      </div>

      {/* Car Cards Grid */}
      {filteredCars.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 mt-8">
          <Icons.Car className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
            Tidak ada mobil yang cocok dengan filter
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau reset filter kategori di atas.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Semua');
              setSelectedTransmission('Semua');
              setSelectedStatus('Semua');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car) => {
            const badge = getCarStatusBadge(car.status);
            const isAvailable = car.status === 'tersedia';

            return (
              <div
                key={car.id}
                className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Car Image & Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={car.gambar}
                    alt={car.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {car.kategori}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-md ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                  </div>

                  {/* Indonesian License Plate Badge */}
                  <div className="absolute bottom-3 left-3">
                    <div className="inline-block px-2.5 py-0.5 rounded-md bg-zinc-950/90 text-white text-[11px] font-mono font-bold tracking-widest border border-zinc-700 shadow-sm">
                      {car.platNomor}
                    </div>
                  </div>
                </div>

                {/* Car Details */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex-1">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {car.merk} &bull; {car.tahun}
                    </span>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-0.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {car.nama}
                    </h3>

                    {/* Spec Icons */}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-1 justify-center">
                        <Icons.Users className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{car.kapasitas} Kursi</span>
                      </div>
                      <div className="flex items-center gap-1 justify-center border-x border-zinc-200 dark:border-zinc-700 px-1">
                        <Icons.Key className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{car.transmisi}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-center">
                        <Icons.Fuel className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{car.bahanBakar}</span>
                      </div>
                    </div>

                    {/* Features Snippet */}
                    <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {car.deskripsi}
                    </p>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-medium">Tarif Sewa</span>
                      <div className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white">
                        {formatRupiah(car.hargaPerHari)}
                        <span className="text-[11px] font-normal text-zinc-500">/hari</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectCar(car)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isAvailable
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <span>{isAvailable ? 'Sewa Sekarang' : 'Detail Mobil'}</span>
                      <Icons.ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
