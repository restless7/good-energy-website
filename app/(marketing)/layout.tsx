// app/(marketing)/layout.tsx
// Marketing pages layout — includes Navbar and Footer for public-facing pages

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-good-white text-good-green">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
