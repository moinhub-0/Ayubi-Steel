import { motion } from 'motion/react';
import { ArrowRight, MessageCircle } from 'lucide-react';

export interface ProductCardProps {
  key?: string | number;
  product: {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    imageUrl: string;
    price?: number;
  };
  categoryTitle?: string;
  index: number;
  onClick?: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

export default function ProductCard({ product, categoryTitle, index, onClick }: ProductCardProps) {
  const phoneNumber = "917853903438";
  const waMsg = `Hi, I am interested in the ${product.title}. Could you provide more details?`;
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMsg)}`;

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={`group relative bg-white border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 rounded-[2.5rem] p-3 flex flex-col ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50 cursor-pointer rounded-[2rem]">
        <motion.img 
          src={product.imageUrl} 
          alt={product.title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#25D366] text-white px-6 py-2.5 rounded-full font-medium text-sm flex items-center shadow-lg hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Enquire
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">
              {categoryTitle || 'Product'}
            </p>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif tracking-tight pr-4">
              {product.title}
            </h3>
          </div>
          {product.price && product.price > 0 && (
            <span className="text-sm font-mono text-zinc-400 border border-zinc-100 px-3 py-1 rounded-full shrink-0">
              ${product.price}
            </span>
          )}
        </div>
        
        <p className="text-zinc-600 text-sm font-light leading-relaxed line-clamp-2 mb-4">
          {product.description}
        </p>
        
        <div className="w-full h-[1px] bg-zinc-100 mb-4"></div>
        
        <div className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-zinc-600 transition-colors uppercase tracking-widest group/link">
          View Details
          <ArrowRight className="ml-2 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
