import React from 'react';
import { getAllCategoriesList } from '@/actions/category.action';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  Home, 
  ChevronRight, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  Briefcase 
} from 'lucide-react';

export default async function CategoriesIndexPage() {
  const groups = await getAllCategoriesList();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#A3E635] selection:text-[#1E40AF]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8">
          <Link href="/" className="hover:text-[#1E40AF] transition-colors flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" />
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-extrabold">Semua Kategori</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-12 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E40AF]/10 text-[#1E40AF] text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-[#1E40AF]" />
            Direktori Lengkap PushAja
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Eksplorasi Seluruh Kategori Jasa
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Temukan ribuan talenta freelance profesional di Indonesia sesuai klasifikasi industri dan kebutuhan bisnis Anda.
          </p>
        </div>

        {/* Grid Kelompok Kategori */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group: any) => (
            <div 
              key={group.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-6"
            >
              <div>
                {/* Header Grup */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#1E40AF]/10 text-[#1E40AF] flex items-center justify-center">
                      {group.icon ? (
                        <div 
                          className="w-5 h-5 flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: group.icon }}
                        />
                      ) : (
                        <Briefcase className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <Link 
                        href={`/categories/${group.slug}`}
                        className="text-base font-black text-slate-900 hover:text-[#1E40AF] transition-colors"
                      >
                        {group.name}
                      </Link>
                      <p className="text-[11px] font-semibold text-slate-400">
                        {group.categories?.length || 0} Subkategori
                      </p>
                    </div>
                  </div>
                </div>

                {/* Daftar Subkategori */}
                <ul className="space-y-2">
                  {group.categories?.map((cat: any) => (
                    <li key={cat.id}>
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="group flex items-center justify-between py-1.5 px-3 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-600 hover:text-[#1E40AF] transition-all"
                      >
                        <span className="truncate">{cat.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#1E40AF] group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tombol Lihat Selengkapnya */}
              <Link
                href={`/categories/${group.slug}`}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-slate-50 hover:bg-[#1E40AF] text-slate-700 hover:text-white text-xs font-extrabold transition-all duration-200"
              >
                Lihat Kategori {group.name}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12 text-center text-xs font-semibold text-slate-400">
        <p>© {new Date().getFullYear()} PushAja Platform Freelance Indonesia. Seluruh hak cipta dilindungi.</p>
      </footer>
    </div>
  );
}
