import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- INITIAL LOAD ANIMATION ---
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Headline split text animation
      const letters = headlineRef.current?.querySelectorAll('.letter');
      if (letters && letters.length > 0) {
        tl.fromTo(
          letters,
          { y: 100, opacity: 0, rotateX: -45 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.04 }
        );
      }

      // 2. Image animation
      if (imageContainerRef.current) {
        tl.fromTo(
          imageContainerRef.current,
          { scale: 0.9, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' },
          '-=0.8'
        );
      }

      // 3. Stats animation
      const stats = statsRef.current?.querySelectorAll('.stat-item');
      if (stats && stats.length > 0) {
        tl.fromTo(
          stats,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15 },
          '-=1'
        );
      }

      // --- SCROLL-BASED ANIMATION ---
      if (containerRef.current) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1, // Smooth scrubbing
          },
        });

        // Parallax background (moves slower)
        if (bgRef.current) {
          scrollTl.to(bgRef.current, { y: '15%', ease: 'none' }, 0);
        }

        // Headline depth (moves slower than image, fades out)
        if (headlineRef.current) {
          scrollTl.to(
            headlineRef.current,
            { y: '40%', opacity: 0.1, scale: 0.95, ease: 'none' },
            0
          );
        }

        // Stats fade out and move up slightly
        if (statsRef.current) {
          scrollTl.to(statsRef.current, { y: '-20%', opacity: 0, ease: 'none' }, 0);
        }

        // Image moves upward, scales up (zoom effect), and rotates slightly
        if (imageContainerRef.current) {
          scrollTl.to(
            imageContainerRef.current,
            {
              y: '-30%',
              scale: 1.15,
              rotationZ: 1,
              ease: 'none',
            },
            0
          );
        }

        // Entire hero fades slightly as it leaves viewport
        scrollTl.to(containerRef.current, { opacity: 0.3, ease: 'none' }, 0);

        // --- BONUS: VELOCITY-BASED BLUR ON IMAGE ---
        const blurProxy = { val: 0 };
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => {
            // Calculate velocity
            const velocity = Math.abs(self.getVelocity());
            // Map velocity to blur amount (cap at 8px)
            const targetBlur = Math.min(velocity / 300, 8);
            
            gsap.to(blurProxy, {
              val: targetBlur,
              duration: 0.3,
              overwrite: true,
              onUpdate: () => {
                if (imageRef.current) {
                  imageRef.current.style.filter = `blur(${blurProxy.val}px)`;
                }
              },
            });
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = ['WELCOME', 'ITZFIZZ'];

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#050505] text-white flex flex-col items-center justify-center"
    >
      {/* Background with radial gradient and noise */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center w-full h-full max-w-7xl px-6 pt-[15vh] md:pt-[20vh]">
        
        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-[0.15em] md:tracking-[0.25em] uppercase text-center flex flex-wrap justify-center gap-x-6 md:gap-x-12 will-change-transform perspective-[1000px]"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          {headlineWords.map((word, wordIdx) => (
            <span key={wordIdx} className="flex whitespace-nowrap">
              {word.split('').map((char, charIdx) => (
                <span
                  key={charIdx}
                  className="letter inline-block will-change-transform transform-gpu"
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* Central Image */}
        <div
          ref={imageContainerRef}
          className="absolute top-[45%] md:top-[50%] w-[90%] md:w-[70%] max-w-5xl aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_100px_rgba(255,255,255,0.05)] will-change-transform transform-gpu z-20"
        >
          <img
            ref={imageRef}
            src="https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2564&auto=format&fit=crop"
            alt="Premium Abstract"
            className="w-full h-full object-cover will-change-transform transform-gpu scale-105"
            crossOrigin="anonymous"
            onLoad={() => ScrollTrigger.refresh()}
          />
          {/* Subtle inner shadow/gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 ring-1 ring-white/10 rounded-2xl md:rounded-3xl pointer-events-none" />
        </div>

        {/* Stats Section */}
        <div
          ref={statsRef}
          className="absolute bottom-12 md:bottom-16 left-0 right-0 flex flex-row justify-center items-center gap-8 md:gap-32 px-6 will-change-transform z-30"
        >
          {[
            { value: '90%', label: 'Growth' },
            { value: '75%', label: 'Performance' },
            { value: '120%', label: 'Efficiency' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="stat-item flex flex-col items-center group cursor-pointer will-change-transform"
            >
              <span className="text-3xl md:text-6xl font-light tracking-tighter text-white group-hover:text-white/80 transition-colors duration-500">
                {stat.value}
              </span>
              <span className="text-[10px] md:text-sm uppercase tracking-[0.2em] text-white/40 mt-2 md:mt-4 group-hover:text-white/70 transition-colors duration-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
