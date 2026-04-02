/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import Hero from './components/Hero';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    // Refresh ScrollTrigger on mount to ensure correct calculations
    ScrollTrigger.refresh();
  }, []);

  return (
    <main className="bg-[#050505] min-h-screen text-white font-sans selection:bg-white/20">
      <Hero />
      
      {/* Dummy content to enable scrolling and showcase the hero animation */}
      <section className="h-screen w-full flex items-center justify-center bg-[#050505] relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white/80 mb-8">
            The Future of Motion
          </h2>
          <p className="text-lg md:text-xl text-white/40 leading-relaxed font-light">
            Scroll back up to experience the seamless integration of GSAP and ScrollTrigger. 
            The hero section utilizes hardware-accelerated transforms, parallax depth, 
            and velocity-based blur to create a premium, native-feeling web experience.
          </p>
        </div>
      </section>
      
      <section className="h-[50vh] w-full flex items-center justify-center bg-[#020202]">
        <div className="text-white/20 text-sm tracking-widest uppercase">
          End of Demo
        </div>
      </section>
    </main>
  );
}
