import { MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhatsAppButton() {
  const phoneNumber = "917853903438"; // Using international format for India by default
  const message = "Hello Ayubi Steel, I am interested in your products.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-2xl z-50 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 1
      }}
    >
      {/* Pulsing ring */}
      <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75 duration-1000"></span>
      
      <MessageSquare className="h-6 w-6 relative z-10" />
      <span className="absolute right-[calc(100%+16px)] bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl pointer-events-none origin-right">
        Chat with us
        {/* Triangle arrow */}
        <span className="absolute top-1/2 -right-1 w-2 h-2 bg-slate-900 border-r border-t border-slate-800 rotate-45 transform -translate-y-1/2"></span>
      </span>
    </motion.a>
  );
}
