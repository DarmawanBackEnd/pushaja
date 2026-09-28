import React from 'react';
import { searchGigsAction } from '@/actions/gig.action';
import Navbar from '@/components/Navbar';
import SearchClient from './SearchClient';
import Link from 'next/link';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || '';
  const category = resolvedSearchParams.category || '';
  const sort = resolvedSearchParams.sort || 'popular';

  const res = await searchGigsAction({
    query: q,
    categorySlug: category,
    sortBy: sort,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#A3E635] selection:text-[#1E40AF]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <SearchClient 
          initialGigs={res.data || []}
          categories={res.categories || []}
          initialQuery={q}
          initialCategory={category}
          initialSort={sort}
          isDemo={res.isDemo}
        />
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12 text-center text-xs font-semibold text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PushAja Platform Freelance Indonesia. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#1E40AF] transition-colors">Beranda</Link>
            <Link href="/categories" className="hover:text-[#1E40AF] transition-colors">Semua Kategori</Link>
            <Link href="/freelancer/apply" className="hover:text-[#1E40AF] transition-colors">Daftar Freelancer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
