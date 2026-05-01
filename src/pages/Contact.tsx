import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-zinc-50 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 uppercase tracking-tight mb-4">Contact Us</h1>
        <p className="text-xl text-zinc-500 font-light mb-16">Get in touch for custom quotes and inquiries.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-zinc-900 mt-1" />
              <div className="ml-4">
                <h3 className="font-bold text-lg text-zinc-900">Visit Our Workshop</h3>
                <p className="text-zinc-600 mt-2">123 Steel Lane, Industrial Area,<br/>City, State, 12345</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-6 w-6 text-zinc-900 mt-1" />
              <div className="ml-4">
                <h3 className="font-bold text-lg text-zinc-900">Call Us</h3>
                <p className="text-zinc-600 mt-2">+91 785390 3438</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-zinc-900 mt-1" />
              <div className="ml-4">
                <h3 className="font-bold text-lg text-zinc-900">Email Us</h3>
                <p className="text-zinc-600 mt-2">info@ayubisteel.com</p>
              </div>
            </div>
          </div>
          
          <form className="space-y-6 bg-white p-8 border border-zinc-200 shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700">Name</label>
              <input type="text" id="name" className="mt-1 block w-full rounded-none border-zinc-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm p-3 border" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">Email</label>
              <input type="email" id="email" className="mt-1 block w-full rounded-none border-zinc-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm p-3 border" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-zinc-700">Message</label>
              <textarea id="message" rows={4} className="mt-1 block w-full rounded-none border-zinc-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm p-3 border"></textarea>
            </div>
            <button type="button" className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 uppercase tracking-widest">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
