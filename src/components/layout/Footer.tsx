import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-zinc-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-2xl tracking-wide uppercase">
              Ayubi <span className="text-zinc-500 font-light">Steel</span>
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              Crafting safety and elegance since the inception of modern architectural steel. We construct the physical and aesthetic foundation of your spaces.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 rounded-full bg-slate-800 text-zinc-400 hover:text-white hover:bg-slate-700 transition-all duration-300">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-800 text-zinc-400 hover:text-white hover:bg-slate-700 transition-all duration-300">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-800 text-zinc-400 hover:text-white hover:bg-slate-700 transition-all duration-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><Link to="/" className="text-zinc-400 hover:text-white transition-colors flex items-center"><span className="w-2 h-[1px] bg-zinc-600 mr-2"></span>Home</Link></li>
              <li><Link to="/products" className="text-zinc-400 hover:text-white transition-colors flex items-center"><span className="w-2 h-[1px] bg-zinc-600 mr-2"></span>Products</Link></li>
              <li><Link to="/about" className="text-zinc-400 hover:text-white transition-colors flex items-center"><span className="w-2 h-[1px] bg-zinc-600 mr-2"></span>About</Link></li>
            </ul>
          </div>
          
          {/* Col 3: Services */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Services</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><Link to="/products" className="text-zinc-400 hover:text-white transition-colors">Steel Railings</Link></li>
              <li><Link to="/products" className="text-zinc-400 hover:text-white transition-colors">Window Grills</Link></li>
              <li><Link to="/products" className="text-zinc-400 hover:text-white transition-colors">Aluminium Windows</Link></li>
              <li><Link to="/products" className="text-zinc-400 hover:text-white transition-colors">Custom Furniture</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex items-start text-zinc-400 group">
                <MapPin className="h-5 w-5 mr-3 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                <span className="leading-relaxed">123 Steel Lane,<br/>Industrial Area</span>
              </li>
              <li className="flex items-center text-zinc-400 group">
                <Phone className="h-5 w-5 mr-3 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                <span>+91 785390 3438</span>
              </li>
              <li className="flex items-center text-zinc-400 group">
                <Mail className="h-5 w-5 mr-3 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                <span>info@ayubisteel.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} <span className="text-white">Ayubi Steel</span>. All rights reserved.</p>
          <p className="mt-4 md:mt-0 tracking-widest uppercase text-zinc-400">
            Developed by <Link to="/developer" className="text-white font-medium hover:underline hover:text-zinc-300 transition-colors">Moinuddin Hasan</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
