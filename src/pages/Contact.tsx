import ContactSection from '../components/ContactSection';

export default function Contact() {
  return (
    <div className="bg-zinc-50 min-h-screen pt-24 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 uppercase tracking-tight mb-4">Contact Us</h1>
        <p className="text-xl text-zinc-500 font-light">Get in touch for custom quotes and inquiries.</p>
      </div>
      <ContactSection />
    </div>
  );
}
