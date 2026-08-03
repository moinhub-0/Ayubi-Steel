import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

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
  price?: number;
}

export default function Products() {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(location.state?.selectedCategoryId || null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.selectedCategoryId) {
      setSelectedCategoryId(location.state.selectedCategoryId);
      window.scrollTo(0, 0);
    }
  }, [location.state]);

  useEffect(() => {
    const unsubCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'categories'));

    const unsubProds = onSnapshot(query(collection(db, 'products'), orderBy('createdAt', 'desc')), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));

    return () => {
      unsubCats();
      unsubProds();
    };
  }, []);

  const phoneNumber = "917853903438";

  const getCategoryImageUrl = (categoryId: string) => {
    const categoryProducts = products.filter(p => p.categoryId === categoryId);
    return categoryProducts.length > 0 ? categoryProducts[0].imageUrl : 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80';
  };

  const getSelectedProduct = () => {
    return products.find(p => p.id === selectedProductId);
  };

  const selectedProduct = getSelectedProduct();

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-zinc-50 min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <AnimatePresence mode="wait">
          {/* CATEGORIES VIEW */}
          {!selectedCategoryId && !selectedProductId && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 uppercase tracking-tight mb-4">Our Collections</h1>
                <div className="h-1 w-16 bg-slate-900 mx-auto mb-6"></div>
                <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto">
                  Explore our range of premium metalwork categories, tailored for excellence.
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-20 bg-white border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl">
                  <p className="text-zinc-500 font-light">No categories available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categories.map((category, i) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      onClick={() => handleCategoryClick(category.id)}
                      className="group relative bg-white rounded-[2.5rem] overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 p-3"
                    >
                      <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-zinc-100">
                        <img 
                          src={getCategoryImageUrl(category.id)}
                          alt={category.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors duration-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                          <h2 className="text-3xl font-bold text-white uppercase tracking-wider drop-shadow-md bg-slate-900/40 px-6 py-3 rounded-2xl backdrop-blur-sm">
                            {category.title}
                          </h2>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* PRODUCTS IN CATEGORY VIEW */}
          {selectedCategoryId && !selectedProductId && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <button 
                onClick={() => setSelectedCategoryId(null)}
                className="mb-8 flex items-center text-sm font-semibold text-zinc-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Collections
              </button>

              <div className="mb-12">
                <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tight mb-4">
                  {categories.find(c => c.id === selectedCategoryId)?.title}
                </h1>
                <div className="h-1 w-16 bg-slate-900 mb-6"></div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                </div>
              ) : products.filter(p => p.categoryId === selectedCategoryId).length === 0 ? (
                <div className="text-center py-20 bg-white border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl">
                  <p className="text-zinc-500 font-light">No products in this category yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.filter(p => p.categoryId === selectedCategoryId).map((prod, i) => (
                    <ProductCard 
                      key={prod.id}
                      product={prod} 
                      categoryTitle={categories.find(c => c.id === prod.categoryId)?.title}
                      index={i} 
                      onClick={() => handleProductClick(prod.id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* PRODUCT DETAIL VIEW */}
          {selectedProductId && selectedProduct && (
            <motion.div
              key="product-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <nav className="flex items-center space-x-2 text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-10">
                <button 
                  onClick={() => { setSelectedProductId(null); setSelectedCategoryId(null); }}
                  className="hover:text-slate-900 transition-colors"
                >
                  Collections
                </button>
                <ChevronRight className="h-4 w-4" />
                <button 
                  onClick={() => setSelectedProductId(null)}
                  className="hover:text-slate-900 transition-colors"
                >
                  {categories.find(c => c.id === selectedProduct.categoryId)?.title}
                </button>
                <ChevronRight className="h-4 w-4" />
                <span className="text-slate-900 line-clamp-1">{selectedProduct.title}</span>
              </nav>

              <div className="bg-white rounded-[3rem] p-6 md:p-8 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-zinc-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                  {/* Image Gallery Area (Single image for now) */}
                  <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-[2.5rem] bg-zinc-50 border border-zinc-100">
                    <img 
                      src={selectedProduct.imageUrl} 
                      alt={selectedProduct.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col justify-center">
                    <div className="mb-8">
                      <span className="inline-block px-4 py-1.5 bg-zinc-100 text-zinc-600 font-semibold text-xs uppercase tracking-widest rounded-full mb-6">
                        {categories.find(c => c.id === selectedProduct.categoryId)?.title || 'Product'}
                      </span>
                      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif tracking-tight leading-tight">
                        {selectedProduct.title}
                      </h1>
                      
                      {selectedProduct.price && selectedProduct.price > 0 && (
                        <div className="text-2xl font-mono text-zinc-500 mb-8 pb-8 border-b border-zinc-100">
                          ${selectedProduct.price}
                        </div>
                      )}

                      <div className="prose prose-zinc max-w-none text-zinc-600 font-light leading-relaxed mb-10">
                        {selectedProduct.description.split('\n').map((paragraph, i) => (
                          <p key={i} className="mb-4">{paragraph}</p>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <a
                        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(`Hi, I am interested in the ${selectedProduct.title}. Could you provide more details?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-[0_8px_25px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.4)] hover:-translate-y-1 transition-all duration-300"
                      >
                        <MessageCircle className="mr-3 h-6 w-6" />
                        Inquire on WhatsApp
                      </a>
                      <p className="text-xs text-zinc-400 mt-4 font-light flex items-center justify-center sm:justify-start">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        Usually responds within an hour
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
