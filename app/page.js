import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Services from "./components/Services";
import WhyChoose from "./components/WhyChoose";
import Portfolio from "./components/Portfolio";
import Process from "./components/Process";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import Brands from "./components/Brands";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import WhatsApp from "./components/WhatsApp";
import ScrollReveal from "./components/ScrollReveal";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <WhyChoose />
        <Portfolio />
        <Process />
        <Testimonials />
        <Pricing />
        <Brands />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsApp />
      <ScrollReveal />
    </>
  );
}
