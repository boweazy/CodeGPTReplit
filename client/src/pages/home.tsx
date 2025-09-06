import StarField from "@/components/StarField";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ContentGenerator from "@/components/ContentGenerator";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen text-foreground overflow-x-hidden" data-testid="home-page">
      <StarField />
      
      <div className="relative z-10">
        <Header />
        <Hero />
        <ContentGenerator />
        <Features />
        <Stats />
        <Footer />
      </div>
    </div>
  );
}
