'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResultsContent from '@/components/results/ResultsContent';

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <ResultsContent />
      <Footer />
    </div>
  );
}
