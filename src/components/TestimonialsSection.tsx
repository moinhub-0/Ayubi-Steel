import React from "react";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, X, MessageSquareHeart } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query, where, setDoc, doc } from 'firebase/firestore';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  image?: string;
  status: string;
  createdAt: number;
}

const hardcodedTestimonials = [
  {
    id: '1',
    name: "Sarah Jenkins",
    role: "Homeowner",
    text: "Ayubi Steel transformed our staircase with a stunning modern steel railing. The craftsmanship is flawless and exactly what we envisioned.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    status: "approved",
    createdAt: Date.now()
  },
  {
    id: '2',
    name: "David Chen",
    role: "Architect",
    text: "As an architect, I appreciate their attention to detail and precision. Their custom window grills perfectly complemented the minimalist design of our latest project.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    status: "approved",
    createdAt: Date.now()
  },
  {
    id: '3',
    name: "Elena Rodriguez",
    role: "Interior Designer",
    text: "Working with them on bespoke furniture pieces was a breeze. They brought my sketches to life with incredible durability and industrial elegance.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
    status: "approved",
    createdAt: Date.now()
  }
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), where('status', '==', 'approved'));
    const unsub = onSnapshot(q, (snapshot) => {
      const dbTestimonials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
      if (dbTestimonials.length > 0) {
        setTestimonials(dbTestimonials.sort((a, b) => b.createdAt - a.createdAt));
      } else {
        setTestimonials(hardcodedTestimonials);
      }
    }, error => handleFirestoreError(error, OperationType.LIST, 'testimonials'));

    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const id = crypto.randomUUID();
      await setDoc(doc(db, 'testimonials', id), {
        name: formData.get('name'),
        role: formData.get('role'),
        text: formData.get('text'),
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'testimonials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-32 bg-white border-t border-zinc-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 flex flex-col items-center justify-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 uppercase tracking-tight">Client Testimonials</h2>
          <div className="h-1 w-12 bg-slate-900 mx-auto mt-6 mb-8"></div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-colors shadow-lg"
          >
            <MessageSquareHeart className="w-5 h-5" />
            <span className="font-medium tracking-wide uppercase text-sm">Leave a Review</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              className="bg-zinc-50 rounded-[2.5rem] p-8 relative shadow-sm border border-zinc-100 flex flex-col"
            >
              <Quote className="h-10 w-10 text-slate-200 absolute top-8 left-8" />
              <div className="relative z-10 pt-8 flex-1 flex flex-col">
                <p className="text-zinc-600 font-light leading-relaxed mb-8 italic flex-1">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center mt-auto">
                  {testimonial.image ? (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-slate-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-200 mr-4 flex items-center justify-center ring-2 ring-slate-100">
                      <span className="text-slate-500 font-bold text-lg">{testimonial.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-zinc-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => { setIsModalOpen(false); setSubmitted(false); }}
                className="absolute top-6 right-6 text-zinc-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquareHeart className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
                  <p className="text-zinc-500 mb-8">Your review has been submitted successfully and is awaiting approval.</p>
                  <button 
                    onClick={() => { setIsModalOpen(false); setSubmitted(false); }}
                    className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-slate-800 transition-colors font-medium tracking-wide uppercase text-sm"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Share Your Experience</h3>
                  <p className="text-zinc-500 mb-8 font-light">We value your feedback. Let us and others know how we did.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        className="w-full border-zinc-200 border rounded-xl p-3 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-slate-900 placeholder:text-zinc-400 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Role / Subtitle</label>
                      <input 
                        type="text" 
                        name="role" 
                        required 
                        className="w-full border-zinc-200 border rounded-xl p-3 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-slate-900 placeholder:text-zinc-400 transition-all"
                        placeholder="e.g. Homeowner, Architect, Client"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Your Review</label>
                      <textarea 
                        name="text" 
                        required 
                        rows={4}
                        className="w-full border-zinc-200 border rounded-xl p-3 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-slate-900 placeholder:text-zinc-400 transition-all resize-none"
                        placeholder="Tell us about the project and our craftsmanship..."
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
