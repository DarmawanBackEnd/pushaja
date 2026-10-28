'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  detail?: string | null;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  detail,
  confirmText = 'Ya, Hapus',
  cancelText = 'Batal',
  isDestructive = true,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-5 text-left animate-in zoom-in-95 duration-200">
        
        {/* Tombol Tutup Silang di Kanan Atas */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Tutup modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Header */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          isDestructive ? 'bg-rose-50 border border-rose-100 text-rose-600' : 'bg-blue-50 border border-blue-100 text-[#1E40AF]'
        }`}>
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Judul & Deskripsi */}
        <div className="space-y-1.5 pr-6">
          <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {description}
          </p>
        </div>

        {/* Catatan / Keterangan Tambahan (jika ada) */}
        {detail && (
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs font-semibold leading-relaxed">
            <span className="font-black text-amber-800 block mb-0.5">Catatan Penting:</span>
            {detail}
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:scale-95 transition-all text-center cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black text-white shadow-md active:scale-95 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
              isDestructive 
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' 
                : 'bg-[#1E40AF] hover:bg-blue-800 shadow-blue-600/20'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
