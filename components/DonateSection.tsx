'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DonateModal } from '@/components/DonateModal';

export const DonateSection = () => {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/feed"
          className="w-full transform rounded-xl bg-orange-600 px-8 py-4 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:bg-orange-700 hover:shadow-xl hover:shadow-orange-500/25 sm:w-auto"
        >
          Comenzar ahora
        </Link>
        <button
          onClick={() => setIsDonateModalOpen(true)}
          className="w-full transform rounded-xl border-2 border-red-100 bg-white px-8 py-4 text-lg font-bold text-gray-900 transition-all hover:-translate-y-1 hover:border-red-200 hover:bg-red-50 hover:text-orange-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:border-red-900 dark:hover:bg-red-900/20 dark:hover:text-red-400 sm:w-auto"
        >
          Donar! 🤍
        </button>
      </div>

      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
      />
    </>
  );
};
