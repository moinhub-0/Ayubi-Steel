import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-zinc-50 min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 uppercase tracking-tight mb-4">Our Gallery</h1>
          <div className="h-1 w-16 bg-slate-900 mx-auto mb-6"></div>
          <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto">
            Discover our range of premium metalwork, from intricate railings to robust aluminium windows.
          </p>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl">
            <p className="text-zinc-500 font-light">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((prod, i) => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                categoryTitle={categories.find(c => c.id === prod.categoryId)?.title}
                index={i} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
