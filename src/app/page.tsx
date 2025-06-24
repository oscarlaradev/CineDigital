import PublicHeader from '@/components/layout/public-header';
import PublicFooter from '@/components/layout/public-footer';
import HeroSection from '@/components/sections/hero';
import AnalysisSection from '@/components/sections/analysis';
import AboutSection from '@/components/sections/about';
import NewsletterSection from '@/components/sections/newsletter';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <HeroSection />
        <AnalysisSection />
        <AboutSection />
        <NewsletterSection />
      </main>
      <PublicFooter />
    </div>
  );
}
