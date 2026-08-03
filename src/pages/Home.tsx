import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import TestimonialsSection from '../components/TestimonialsSection';

interface Category {
  id: string;
  title: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  imageUrl: string;
}

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    bannerTitle: 'Premium Metalwork for Modern Homes',
    bannerSubtitle: 'Industrial elegance combined with uncompromising durability. Custom steel stair railings, window grills, and architectural furniture.',
    homeBannerImage: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
         setSettings((prev) => ({ ...prev, ...docSnap.data() }));
      }
    }, error => handleFirestoreError(error, OperationType.GET, 'settings/global'));

    const unsubCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'categories'));

    const unsubProds = onSnapshot(query(collection(db, 'products'), orderBy('createdAt', 'desc')), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));

    return () => {
      unsubSettings();
      unsubCats();
      unsubProds();
    };
  }, []);

  const getCategoryImageUrl = (categoryId: string) => {
    const categoryProducts = products.filter(p => p.categoryId === categoryId);
    return categoryProducts.length > 0 ? categoryProducts[0].imageUrl : 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80';
  };
  
  const getCategoryDescription = (categoryId: string) => {
    const categoryProducts = products.filter(p => p.categoryId === categoryId);
    return categoryProducts.length > 0 ? categoryProducts[0].description : 'Explore our custom metalwork collection designed for excellence.';
  };

  return (
    <div>
      <section className="relative min-h-[calc(100vh-2rem)] flex items-center justify-center bg-slate-900 overflow-hidden m-4 md:m-8 rounded-[3rem] shadow-2xl">
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
            {categories.map((category, i) => (
              <motion.div 
                key={category.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                onClick={() => navigate('/products', { state: { selectedCategoryId: category.id } })}
                className="group bg-white rounded-[2.5rem] p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 border border-zinc-100 flex flex-col cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden relative rounded-[2rem]">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img src={getCategoryImageUrl(category.id)} alt={category.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{category.title}</h3>
                  <p className="text-zinc-600 font-light leading-relaxed line-clamp-2">{getCategoryDescription(category.id)}</p>
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
