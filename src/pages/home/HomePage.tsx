'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
 
  useEffect(() => {
    const handleScroll = () => {
      const newScrollY = window.scrollY;
      setScrollY(newScrollY);
      
      // Parallax effect
      document.querySelectorAll('[data-speed]').forEach(element => {
        const speedValue = element.getAttribute('data-speed');
        if (speedValue === null) return;
        
        const speed = parseFloat(speedValue);
        const yPos = -(newScrollY * speed);
        
        const htmlElement = element as HTMLElement;
        htmlElement.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });

      // Intersection observer for animations
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Hero Section - Amélioré */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background avec plusieurs couches */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80')" }}
          data-speed="0.5"
        />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse"
            data-speed="0.2"
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
            data-speed="0.3"
          />
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/25 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
            data-speed="0.4"
          />
        </div>
        
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900"
          data-speed="0.1"
        />
        
        {/* Hero Content - Plus responsive */}
        <div className="text-center relative z-10 px-4 max-w-5xl mx-auto" data-speed="0.6">
          <div className="transform transition-all duration-1000 ease-out">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-none">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                SaveLink
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto mb-8 text-slate-300 font-light leading-relaxed">
              Save, organize, and access your important web links anytime, anywhere
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-10">
              <Link href="/register" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 sm:px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                <span className="flex items-center justify-center gap-2">
                  Start Saving
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/login"
                className="group bg-transparent backdrop-blur-sm border-2 border-white/50 hover:border-white hover:bg-white/10 font-bold py-4 px-8 sm:px-10 rounded-full text-lg transition-all duration-300 hover:shadow-lg"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator - Amélioré */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          data-speed="0.3"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-slate-400">Scroll down</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Layout amélioré */}
      <section className="py-16 sm:py-20 lg:py-32 px-4 relative">
        <div className="max-w-7xl mx-auto ">
          {/* Section Header */}
          <div 
            id="features-header"
            data-animate
            className={`text-center mb-16 sm:mb-20 transition-all  duration-1000 ${
              isVisible['features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover the tools that will revolutionize how you manage and organize your web links
            </p>
          </div>
          
          {/* Features Grid - Responsive amélioré */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mt-60">
            {features.map((feature, index) => (
              <div 
                key={index}
                id={`feature-${index}`}
                data-animate
                className={`group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 ${
                  isVisible[`feature-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                data-speed={0.05 * (index + 1)}
              >
                <div className="text-blue-400 mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div 
          className="absolute top-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          data-speed="0.1"
        />
        <div 
          className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          data-speed="0.15"
        />
      </section>

      {/* Testimonials Section - Design amélioré */}
      <section className="py-16 sm:py-20 lg:py-32 px-4 relative bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div 
            id="testimonials-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible['testimonials-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-slate-400 text-lg sm:text-xl mb-16 max-w-3xl mx-auto">
              Hear from people who have transformed their link management with SaveLink
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-40">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                id={`testimonial-${index}`}
                data-animate
                className={`group bg-gradient-to-br mt-40 from-slate-900/90 to-slate-800/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/50 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 ${
                  isVisible[`testimonial-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                data-speed={0.03 * (index + 1)}
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-slate-400">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed italic group-hover:text-white transition-colors">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Plus impactant */}
      <section className="py-16 sm:py-20 lg:py-32 px-4 relative">
        <div 
          id="cta-section"
          data-animate
          className={`max-w-5xl mx-auto transition-all duration-1000 mt-40 ${
            isVisible['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div 
            className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-8 sm:p-12 lg:p-16 rounded-3xl relative overflow-hidden shadow-2xl"
            data-speed="0.05"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
            <div 
              className="absolute inset-0 opacity-20 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80')" }}
              data-speed="0.2"
            />
            
            {/* Floating elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Ready to Save Your Links?
              </h2>
              <p className="text-blue-100 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                Join thousands of users who have already organized their digital life with SaveLink.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="group bg-white text-slate-900 font-bold py-4 px-8 sm:px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  <span className="flex items-center justify-center gap-2">
                    Start Free
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                <button className="bg-transparent border-2 border-white/50 hover:border-white hover:bg-white/10 font-bold py-4 px-8 sm:px-10 rounded-full text-lg transition-all duration-300">
                  View Demo
                </button>
              </div>
              <p className="mt-6 text-blue-200 text-sm">
                No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Amélioré et responsive */}
      <footer className="py-12 sm:py-16 px-4 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="ml-3 text-2xl font-bold">SaveLink</span>
              </div>
              <p className="text-slate-400">© 2024 SaveLink. All rights reserved.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
              {['About', 'Features', 'Pricing', 'Contact', 'Support'].map((item, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-slate-400 hover:text-white transition-colors duration-300 hover:underline underline-offset-4"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Sample data - Related to SaveLink
const features = [
  {
    icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
    title: "Smart Bookmarking",
    description: "Save any web page with one click. Our smart system automatically captures titles, descriptions, and tags for easy organization."
  },
  {
    icon: "M19 11H5m14-7l2 2-2 2m2-2H9m10 7l2 2-2 2m2-2H9",
    title: "Quick Access",
    description: "Access your saved links instantly from any device. Search, filter, and organize your collection with lightning-fast performance."
  },
  {
    icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v3m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
    title: "Auto-Categorization",
    description: "AI-powered categorization automatically sorts your links into meaningful collections, making organization effortless."
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "Digital Marketer",
    quote: "SaveLink has revolutionized how I manage my research. No more lost bookmarks or forgotten resources!"
  },
  {
    name: "Mike Chen",
    title: "Software Developer",
    quote: "As a developer, I save hundreds of links daily. SaveLink's tagging system keeps everything perfectly organized."
  },
  {
    name: "Emma Williams",
    title: "Content Creator",
    quote: "The cross-device sync is amazing. I can save links on my phone and access them instantly on my laptop."
  },
  {
    name: "David Rodriguez",
    title: "Research Analyst",
    quote: "The search functionality is incredibly fast. I can find any saved link in seconds, even from months ago."
  }
];

export default HomePage;