import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TestimonialsSection from '../components/TestimonialsSection';

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  
  const [settings, setSettings] = useState({
    bannerTitle: 'Premium Metalwork for Modern Homes',
    bannerSubtitle: 'Industrial elegance combined with uncompromising durability. Custom steel stair railings, window grills, and architectural furniture.',
    homeBannerImage: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80',
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
         setSettings((prev) => ({ ...prev, ...docSnap.data() }));
      }
    }, error => handleFirestoreError(error, OperationType.GET, 'settings/global'));
    return () => unsub();
  }, []);

  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ backgroundImage: `url('${settings.homeBannerImage}')`, y: y1 }}
        />
        <div className="absolute inset-0 bg-slate-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/60 to-slate-900"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter uppercase mb-6 leading-none drop-shadow-2xl"
          >
            {settings.bannerTitle.split(' ').map((word, i, arr) => (
               <span key={i} className={i >= arr.length - 2 ? "text-zinc-400 font-serif italic" : ""}>
                 {word}{i !== arr.length - 1 ? ' ' : ''}
               </span>
            ))}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl text-zinc-100 font-light mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
          >
            {settings.bannerSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/products" className="group inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 hover:bg-zinc-200 transition-colors uppercase tracking-widest text-sm font-semibold rounded-full">
              Explore Our Work
              <ArrowRight className="ml-3 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 uppercase tracking-tight">Our Expertise</h2>
            <div className="h-1 w-12 bg-slate-900 mx-auto mt-6"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Steel Railings", desc: "Elegant and secure stair and balcony railings crafted from premium stainless steel.", img: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80" },
              { title: "Aluminium Windows", desc: "Sleek sliding and standard aluminium windows built for durability and aesthetics.", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80" },
              { title: "Custom Furniture", desc: "Bespoke tea tables, dining tables, and chairs combining raw metal with modern design.", img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                className="group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 border border-zinc-100"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-zinc-600 font-light leading-relaxed">{item.desc}</p>
                  <div className="h-0.5 w-0 bg-slate-900 mt-6 group-hover:w-full transition-all duration-500 ease-out"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />
    </div>
  );
}
