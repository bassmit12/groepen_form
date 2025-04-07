"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-[500px] lg:min-h-[600px]">
      <Image
        src="/Groepen-groepsaccommodaties-nederland.png"
        alt="Groepsaccommodatie met mensen die genieten van een barbecue"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
      <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-3xl py-20 lg:py-32">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Verhuur uw groepsaccommodatie
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-12">
            Vul het formulier in om uw accommodatie aan te melden en deel uit te
            maken van ons netwerk van 1300+ groepsaccommodaties
          </p>
          <button
            onClick={() => {
              const form = document.getElementById("property-form");
              form?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-accent hover:bg-accent/90 rounded-md transition-colors group"
          >
            Vul het formulier in
            <ArrowDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
