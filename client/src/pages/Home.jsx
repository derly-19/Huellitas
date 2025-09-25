// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import AdoptionSection from "../components/AdoptionSection";
import InfoSection from "../components/InfoSection";
import CallToAction from "../components/CallToAction";

export default function Home() {
  const cats = [
    { name: "Bella", img: "/g1.jpg" },
    { name: "Luna", img: "/g2.jpg" },
    { name: "Milo", img: "/g3.jpg" },
  ];

  const dogs = [
    { name: "Rocky", img: "/p1.jpg" },
    { name: "Max", img: "/p2.jpg" },
    { name: "Nina", img: "/p3.jpg" },
  ];

  return (
    <div className="bg-[#FFFCF4]">
      <Hero />

      {/* Sección de gatos */}
      <div className="mb-20">
        <AdoptionSection title="Gatos en adopción" pets={cats} />
      </div>

      {/* Sección de perros */}
      <div className="mb-20">
        <AdoptionSection title="Perros en adopción" pets={dogs} />
      </div>

      {/* Sección informativa */}
      <div className="mb-20">
        <InfoSection />
      </div>

      {/* Call to action */}
      <div className="mb-16">
        <CallToAction />
      </div>
    </div>
  );
}
