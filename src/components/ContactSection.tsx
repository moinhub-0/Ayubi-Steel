import React from "react";
import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Mail, Phone, MapPin, Instagram, Youtube } from 'lucide-react';

export default function ContactSection() {
  const [settings, setSettings] = useState({
    contactPhone: '+91 785390 3438',
    contactEmail: 'info@ayubisteel.com',
    address: 'Bhubaneswar, Odisha, India',
    instagramUrl: '#',
    youtubeUrl: '#'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
         const data = docSnap.data();
         setSettings((prev) => ({ 
           contactPhone: data.contactPhone || prev.contactPhone,
           contactEmail: data.contactEmail || prev.contactEmail,
           address: data.address || prev.address,
           instagramUrl: data.instagramUrl || prev.instagramUrl,
           youtubeUrl: data.youtubeUrl || prev.youtubeUrl
         }));
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const name = `${formData.get('firstName')} ${formData.get('lastName')}`;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    
    try {
      await addDoc(collection(db, 'messages'), {
        name,
        email,
        phone,
        message,
        createdAt: Date.now(),
        status: 'new'
      });
      alert('Message sent successfully!');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Contact Info */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 mb-4 tracking-tight">
              We'd Love to Hear From You
            </h2>
            <p className="text-lg text-zinc-600 mb-12 font-light">
              Have a question about our custom metalwork or your order?<br />
              We're always happy to connect.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-slate-900 shadow-lg rounded-full flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Email Details</h3>
                  <p className="text-slate-900 font-medium text-lg">{settings.contactEmail}</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-slate-900 shadow-lg rounded-full flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Phone</h3>
                  <p className="text-slate-900 font-medium text-lg">{settings.contactPhone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-slate-900 shadow-lg rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Address</h3>
                  <p className="text-slate-900 font-medium text-lg">{settings.address}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg">
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg">
                <Youtube className="h-5 w-5 text-white" />
              </a>
            </div>
            
            <div className="mt-12 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
               <p className="text-sm text-zinc-600 mb-2"><strong className="text-slate-900">Trade-Name:</strong> Ayubi Steel</p>
               <p className="text-sm text-zinc-600"><strong className="text-slate-900">Legal Name:</strong> Azhar Ayubi</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">First Name</label>
                  <input type="text" name="firstName" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all placeholder:text-zinc-500" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Last Name</label>
                  <input type="text" name="lastName" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all placeholder:text-zinc-500" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Phone Number</label>
                <input type="tel" name="phone" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all placeholder:text-zinc-500" placeholder="+91 00000 00000" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                <input type="email" name="email" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all placeholder:text-zinc-500" placeholder="name@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Message / Comments</label>
                <textarea name="message" rows={4} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all resize-none placeholder:text-zinc-500" placeholder="How can we help you?"></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-white hover:bg-zinc-200 text-slate-900 font-bold py-4 rounded-xl transition-colors mt-6 shadow-lg uppercase tracking-wider disabled:opacity-70">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
