import { motion } from 'motion/react';
import { Award, Shield, Compass } from 'lucide-react';
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export default function About() {
  const [settings, setSettings] = useState({
    aboutTitle: 'Craftsmanship meets durability.',
    aboutSubtitle: 'With over two decades of experience, Ayubi Steel has established itself as the premier choice for custom metalwork.',
    aboutFounderStory: 'Founded with a vision to bring industrial strength into modern design, we take pride in every weld and cut.',
    aboutBannerImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80',
    aboutFounderImage: 'https://images.unsplash.com/photo-1542456434-6c39f1cdeccb?auto=format&fit=crop&q=80'
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
         const data = docSnap.data();
         setSettings((prev) => ({ 
           aboutTitle: data.aboutTitle || prev.aboutTitle,
           aboutSubtitle: data.aboutSubtitle || prev.aboutSubtitle,
           aboutFounderStory: data.aboutFounderStory || prev.aboutFounderStory,
           aboutBannerImage: data.aboutBannerImage || prev.aboutBannerImage,
           aboutFounderImage: data.aboutFounderImage || prev.aboutFounderImage
         }));
      }
    }, error => handleFirestoreError(error, OperationType.GET, 'settings/global'));
    return () => unsub();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="bg-zinc-50 min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: `url('${settings.aboutBannerImage}')` }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-6 uppercase"
          >
            {settings.aboutTitle.split(' ').map((word, i, arr) => (
               <span key={i} className={i >= arr.length - 1 ? "text-zinc-400 font-serif italic pr-2" : "pr-2"}>{word}</span>
            ))}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-zinc-400 font-light leading-relaxed"
          >
            {settings.aboutSubtitle}
          </motion.p>
        </div>
      </section>

      {/* Content Section - Azhar Ayubi */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Image Side */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative aspect-[4/5] bg-zinc-200 rounded-3xl overflow-hidden shadow-2xl group"
            >
               <img 
                 src={settings.aboutFounderImage} 
                 alt="Welding craftsmanship" 
                 className="absolute inset-0 w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
               />
               <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10"></div>
            </motion.div>

            {/* Story text */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.2 } }
              }}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <p className="text-sm font-semibold tracking-widest text-zinc-500 uppercase mb-3">Founder's Story</p>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                  Strength Should Never <br/> Compromise Style.
                </h2>
                <div className="h-1 w-20 bg-slate-900 mt-6"></div>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="prose prose-zinc prose-lg text-zinc-600 font-light leading-relaxed whitespace-pre-line">
                <p>
                  {settings.aboutFounderStory}
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="pt-8 border-t border-zinc-200">
                <blockquote className="text-xl italic text-slate-800 font-serif border-l-4 border-zinc-300 pl-6 my-6 bg-zinc-50 py-4 pr-4 rounded-r-2xl relative shadow-sm">
                  <span className="absolute top-0 left-2 text-4xl text-zinc-300">"</span>
                  Architecture begins where engineering ends. At Ayubi Steel, we engineer for strength, and design for the soul.
                  <footer className="block mt-4 text-sm font-sans font-semibold text-zinc-500 uppercase tracking-widest not-italic">
                    — Azhar Ayubi
                  </footer>
                </blockquote>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
             <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Our Core Values</h2>
             <div className="h-1 w-12 bg-slate-900 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {[
               { icon: <Shield className="h-8 w-8 text-zinc-900"/>, title: "Uncompromising Security", desc: "Our grills and gates are constructed to provide absolute peace of mind without looking like a fortress." },
               { icon: <Award className="h-8 w-8 text-zinc-900"/>, title: "Master Craftsmanship", desc: "Every joint, weld, and polish is executed with precision by seasoned professionals who take pride in their art." },
               { icon: <Compass className="h-8 w-8 text-zinc-900"/>, title: "Modern Aesthetics", desc: "We constantly evolve our designs to match contemporary architectural trends, ensuring your home looks its best." }
             ].map((val, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.2, duration: 0.6 }}
                 className="text-center p-8 bg-zinc-50 border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-3xl"
               >
                 <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-sm mb-6 border border-zinc-100">
                   {val.icon}
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                 <p className="text-zinc-600 font-light leading-relaxed text-sm">{val.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}
