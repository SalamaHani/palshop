'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';
import { Search, ArrowRight } from 'lucide-react';
import ProductCardHero from '@/components/Home/Cardhero';
import AllCollections from '@/components/view/AllCollections';
import Image from 'next/image';
import ShopifySearchInput from '@/components/search/search';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = Math.ceil(products.length / 6);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [slidesCount]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <main className="relative">
        {/* Hero Section with Products Scattered Around Search */}
        <section className="relative overflow-hidden z-10  min-h-[90vh] flex items-center">
          <div className="mx-auto w-full">
            {/* Products Carousel - Scattered Around Search */}
            <div className="relative min-h-[460px] lg:min-h-[555px] flex flex-col">
              <div className="z-999 flex w-full flex-col items-center justify-center px-space-16 h-[60svh]  md:h-[calc(60svh-1rem)] lg:h-[calc(65svh-1rem)] pointer-events-none absolute">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center text-5xl md:text-7xl lg:text-8xl xl:text-[120px] font-bold mb-6 md:mb-8">
                  <span className="text-6xl font-bold bg-[#215732] bg-clip-text text-transparent">
                    Shop
                  </span>
                </motion.h1>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="pointer-events-auto z-100 mx-auto mt-space-32 flex w-full flex-col md:mt-space-24 max-w-[300px]  md:max-w-[500px]">
                  <div className="relative ">
                    <ShopifySearchInput />
                  </div>
                </motion.div>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.32, 0.72, 0, 1]
                  }}
                  className="absolute inset-0"
                >
                  <div className="lg:hidden block md:block">
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute p- top-[-10%] right-[57%]  -translate-x-1/2 w-30 xl:w-40 z-10"
                    >
                      <div className={`w-110 h-60 bg-white rounded-3xl z-99  overflow-hidden `}>
                        <Image
                          width={150}
                          height={150}
                          src="/images/pal-shopisimge.png"
                          alt="hero-1"
                          className="w-full h-full object-cover rounded-2xl" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Desktop: Products Scattered Around Search Bar */}
                  <div className="lg:block hidden md:hidden">
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute top-[3%] left-[3%] w-35 xl:w-30"
                    >
                      {products[currentSlide * 1] && <ProductCardHero product={products[currentSlide * 1]} />}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute top-[1%] left-[20%] w-35 xl:w-30"
                    >
                      {products[currentSlide * 1 + 1] && <ProductCardHero product={products[currentSlide * 1 + 1]} />}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute p-3 bottom-[20%] right-[-1%]  -translate-x-1/2 w-30 xl:w-40 z-10"
                    >
                      {products[currentSlide * 1 + 2] && <ProductCardHero product={products[currentSlide * 1 + 2]} />}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute p- top-[-6%] right-[47%]  -translate-x-1/2 w-30 xl:w-40 z-10"
                    >
                      <div className={`w-110 h-60 bg-white rounded-3xl z-99  overflow-hidden `}>
                        <Image
                          width={200}
                          height={200}
                          src="/images/pal-shopisimge.png"
                          alt="hero-1"
                          className="w-full h-full object-cover rounded-2xl" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute bottom-[-3%] right-[20%] w-35 xl:w-30"
                    >
                      {products[currentSlide * 1 + 3] && <ProductCardHero product={products[currentSlide * 1 + 3]} />}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute top-[3%] right-[20%] w-35 xl:w-30"
                    >
                      {products[currentSlide * 1 + 4] && <ProductCardHero product={products[currentSlide * 1 + 4]} />}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute bottom-0 left-[10%] w-35 xl:w-30"
                    >
                      {products[currentSlide * 1 + 5] && <ProductCardHero product={products[currentSlide * 1 + 5]} />}
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slide Indicators */}
              <div className="absolute lg:block hidden md:hidden bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20 items-center">
                {Array.from({ length: slidesCount }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`rounded-full transition-all m-1  duration-300 ease-in-out relative overflow-hidden ${index === currentSlide
                      ? 'bg-gray-300 dark:bg-gray-600 w-10 h-2'
                      : 'bg-gray-300 dark:bg-gray-600 w-2 h-2 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {index === currentSlide && (
                      <motion.div
                        key={`progress-${currentSlide}`}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{
                          duration: 5,
                          ease: 'linear'
                        }}
                        className="absolute inset-0 bg-[#215732] dark:bg-[#2d7a48] rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <AllCollections />
      </main>

    </div>
  );
}
