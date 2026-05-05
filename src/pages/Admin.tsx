import { useState, useEffect } from 'react';
import { Settings, Image as ImageIcon, LayoutList, LogOut, Plus, Trash2, Edit2, Loader2, LayoutDashboard, MessageSquare, CheckCircle } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType, storage } from '../lib/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

interface GlobalSettings {
  bannerTitle: string;
  bannerSubtitle: string;
  contactPhone: string;
  contactEmail: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutFounderStory?: string;
  address: string;
  instagramUrl: string;
  youtubeUrl: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: number;
  status: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  image?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  updatedAt: number;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'categories' | 'products' | 'messages' | 'testimonials' | 'settings'>('dashboard');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<GlobalSettings>({
    bannerTitle: 'Premium Metalwork for Modern Homes',
    bannerSubtitle: 'Industrial elegance combined with uncompromising durability.',
    contactPhone: '+91 785390 3438',
    contactEmail: 'info@ayubisteel.com',
    aboutTitle: 'Craftsmanship meets durability.',
    aboutSubtitle: 'With over two decades of experience, Ayubi Steel has established itself as the premier choice for custom metalwork.',
    aboutFounderStory: 'Founded with a vision to bring industrial strength into modern design, we take pride in every weld and cut.',
    homeBannerImage: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80',
    aboutBannerImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80',
    aboutFounderImage: 'https://images.unsplash.com/photo-1542456434-6c39f1cdeccb?auto=format&fit=crop&q=80',
    address: 'Bhubaneswar, Odisha, India',
    instagramUrl: '#',
    youtubeUrl: '#'
  });

  const [isEditingCategory, setIsEditingCategory] = useState<Category | null>(null);
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, isSetting: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      if (isSetting) {
        setSettings(prev => ({ ...prev, [fieldName]: url }));
      } else {
        setIsEditingProduct(prev => prev ? { ...prev, imageUrl: url } : null);
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        if (u.email === 'moincomp06@gmail.com') {
          setIsAdmin(true);
        } else {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', u.uid));
            setIsAdmin(adminDoc.exists());
          } catch (e) {
            console.error("Could not verify admin status", e);
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const unsubCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
    }, error => handleFirestoreError(error, OperationType.LIST, 'categories'));

    const unsubProds = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    }, error => handleFirestoreError(error, OperationType.LIST, 'products'));

    const unsubMessages = onSnapshot(collection(db, 'messages'), (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Message)).sort((a, b) => b.createdAt - a.createdAt));
    }, error => handleFirestoreError(error, OperationType.LIST, 'messages'));

    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      setTestimonials(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)).sort((a, b) => b.createdAt - a.createdAt));
    }, error => handleFirestoreError(error, OperationType.LIST, 'testimonials'));

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as GlobalSettings);
      }
    }, error => handleFirestoreError(error, OperationType.GET, 'settings/global'));

    return () => {
      unsubCats();
      unsubProds();
      unsubMessages();
      unsubTestimonials();
      unsubSettings();
    };
  }, [isAdmin]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const saveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    
    if (!title) return;

    const isEditing = Boolean(isEditingCategory?.id);
    const id = isEditingCategory?.id || crypto.randomUUID();
    const now = Date.now();
    
    try {
      if (!isEditing) {
        await setDoc(doc(db, 'categories', id), {
          title,
          updatedAt: now,
          createdAt: now
        });
      } else {
        await setDoc(doc(db, 'categories', id), {
          title,
          updatedAt: now
        }, { merge: true });
      }
      setIsEditingCategory(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'categories');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'categories');
    }
  };

  const saveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const priceStr = formData.get('price') as string;
    
    if (!title || !description || !categoryId) {
      alert("Please fill out all required fields (Title, Category, Description).");
      return;
    }

    const isEditing = Boolean(isEditingProduct?.id);
    
    if (!imageUrl && !isEditing) {
      alert("Please select and upload an image for the product.");
      return;
    }

    const id = isEditingProduct?.id || crypto.randomUUID();
    const now = Date.now();
    
    const prodData = {
      title,
      description,
      categoryId,
      imageUrl,
      price: priceStr ? parseFloat(priceStr) : 0,
      updatedAt: now,
    };

    try {
      if (!isEditing) {
        await setDoc(doc(db, 'products', id), {
          ...prodData,
          createdAt: now
        });
      } else {
        await setDoc(doc(db, 'products', id), prodData, { merge: true });
      }
      setIsEditingProduct(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'products');
    }
  };

  const markMessageAsRead = async (id: string) => {
    try {
      await setDoc(doc(db, 'messages', id), { status: 'read' }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'messages');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'messages');
    }
  };

  const updateTestimonialStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await setDoc(doc(db, 'testimonials', id), { status, updatedAt: Date.now() }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'testimonials');
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'testimonials');
    }
  };

  const saveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const dataToSave = {
        bannerTitle: formData.get('bannerTitle') as string || '',
        bannerSubtitle: formData.get('bannerSubtitle') as string || '',
        contactPhone: formData.get('contactPhone') as string || '',
        contactEmail: formData.get('contactEmail') as string || '',
        aboutTitle: formData.get('aboutTitle') as string || '',
        aboutSubtitle: formData.get('aboutSubtitle') as string || '',
        aboutFounderStory: formData.get('aboutFounderStory') as string || '',
        homeBannerImage: formData.get('homeBannerImage') as string || '',
        aboutBannerImage: formData.get('aboutBannerImage') as string || '',
        aboutFounderImage: formData.get('aboutFounderImage') as string || '',
        updatedAt: Date.now()
      };
      await setDoc(doc(db, 'settings', 'global'), dataToSave, { merge: true });
      alert('Settings saved successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/global');
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50"><Loader2 className="animate-spin text-zinc-900" /></div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-zinc-50 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight mb-2">Admin Portal</h2>
          <p className="text-zinc-500 mb-8 font-light text-sm">Secure access for Ayubi Steel management.</p>
          
          {user && !isAdmin ? (
            <div className="text-red-500 mb-4 bg-red-50 p-3 rounded text-sm">
              You do not have admin privileges. Your UID is: <br/>
              <span className="font-mono text-xs text-zinc-700 mt-1 block">{user.uid}</span>
              <button onClick={handleLogout} className="mt-4 text-zinc-900 underline">Logout</button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="w-full bg-slate-900 text-white p-3 uppercase tracking-widest text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-zinc-50 pt-16">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-zinc-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
           <h2 className="text-xl font-bold text-white uppercase tracking-widest shrink-0">Dashboard</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-8">
          <button 
            onClick={() => { setActiveTab('dashboard'); setIsEditingCategory(null); setIsEditingProduct(null); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Analytics</span>
          </button>
          <button 
            onClick={() => { setActiveTab('categories'); setIsEditingCategory(null); setIsEditingProduct(null); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'categories' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutList className="h-5 w-5" />
            <span>Categories</span>
          </button>
          <button 
            onClick={() => { setActiveTab('products'); setIsEditingCategory(null); setIsEditingProduct(null); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'products' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <ImageIcon className="h-5 w-5" />
            <span>Manage Products</span>
          </button>
          <button 
            onClick={() => { setActiveTab('messages'); setIsEditingCategory(null); setIsEditingProduct(null); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-colors ${activeTab === 'messages' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </div>
            {messages.filter(m => m.status === 'new').length > 0 && (
              <span className="bg-slate-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{messages.filter(m => m.status === 'new').length}</span>
            )}
          </button>
          <button 
            onClick={() => { setActiveTab('testimonials'); setIsEditingCategory(null); setIsEditingProduct(null); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-colors ${activeTab === 'testimonials' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5" />
              <span>Testimonials</span>
            </div>
            {testimonials.filter(t => t.status === 'pending').length > 0 && (
              <span className="bg-slate-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{testimonials.filter(t => t.status === 'pending').length}</span>
            )}
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setIsEditingCategory(null); setIsEditingProduct(null); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings className="h-5 w-5" />
            <span>Business Details</span>
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-auto">
        {activeTab === 'dashboard' && (
          <div className="max-w-5xl">
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight mb-8">Analytics Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="text-zinc-500 text-sm font-medium uppercase tracking-wider mb-2">Total Products</div>
                <div className="text-4xl font-bold text-slate-900">{products.length}</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="text-zinc-500 text-sm font-medium uppercase tracking-wider mb-2">Categories</div>
                <div className="text-4xl font-bold text-slate-900">{categories.length}</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="text-zinc-500 text-sm font-medium uppercase tracking-wider mb-2">New Messages</div>
                <div className="text-4xl font-bold text-slate-900">{messages.filter(m => m.status === 'new').length}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Categories</h1>
              <button 
                onClick={() => setIsEditingCategory({ id: '', title: '' })}
                className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 uppercase text-xs tracking-widest transition-colors"
                disabled={isEditingCategory !== null}
              >
                <Plus className="h-4 w-4" /> <span>Add Category</span>
              </button>
            </div>

            {isEditingCategory && (
              <form onSubmit={saveCategory} className="bg-white p-6 border border-zinc-100 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-3xl">
                <h3 className="text-lg font-bold mb-4">{isEditingCategory.id ? 'Edit Category' : 'New Category'}</h3>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={isEditingCategory.title} 
                  placeholder="Category Title" 
                  className="w-full border border-zinc-300 p-2 mb-4 focus:ring-slate-900 focus:border-slate-900"
                  required 
                />
                <div className="flex space-x-2">
                  <button type="submit" className="bg-slate-900 text-white px-5 py-2 text-sm rounded-full">Save</button>
                  <button type="button" onClick={() => setIsEditingCategory(null)} className="bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-800 px-5 py-2 text-sm rounded-full">Cancel</button>
                </div>
              </form>
            )}

            <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <table className="w-full text-left text-sm text-zinc-600">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                      <td className="px-6 py-4 font-medium text-zinc-900">{cat.title}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => setIsEditingCategory(cat)} className="text-zinc-400 hover:text-slate-900"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => deleteCategory(cat.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr><td colSpan={2} className="px-6 py-8 text-center text-zinc-400">No categories found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="max-w-5xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Products</h1>
              <button 
                onClick={() => setIsEditingProduct({ id: '', title: '', description: '', categoryId: '', imageUrl: '' })}
                className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 uppercase text-xs tracking-widest transition-colors"
                disabled={isEditingProduct !== null}
              >
                <Plus className="h-4 w-4" /> <span>Add Product</span>
              </button>
            </div>

            {isEditingProduct && (
              <form onSubmit={saveProduct} className="bg-white p-6 border border-zinc-100 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-3xl">
                <h3 className="text-lg font-bold mb-4">{isEditingProduct.id ? 'Edit Product' : 'New Product'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Title</label>
                    <input type="text" name="title" defaultValue={isEditingProduct.title} className="w-full border border-zinc-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" required />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Category</label>
                    <select name="categoryId" defaultValue={isEditingProduct.categoryId} className="w-full border border-zinc-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" required>
                      <option value="">Select a category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-zinc-500 mb-1">Image {uploadingImage && '(Uploading...)'}</label>
                    {isEditingProduct.imageUrl && (
                      <div className="mb-2">
                        <img src={isEditingProduct.imageUrl} alt="Preview" className="h-32 object-cover rounded-xl border border-zinc-200" />
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'imageUrl', false)} className="w-full border border-zinc-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                    <input type="hidden" name="imageUrl" value={isEditingProduct.imageUrl} />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Price (Optional)</label>
                    <input type="number" name="price" defaultValue={isEditingProduct.price} className="w-full border border-zinc-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-zinc-500 mb-1">Description</label>
                    <textarea name="description" defaultValue={isEditingProduct.description} rows={3} className="w-full border border-zinc-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" required></textarea>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button type="submit" className="bg-slate-900 text-white px-5 py-2 text-sm rounded-full">Save</button>
                  <button type="button" onClick={() => setIsEditingProduct(null)} className="bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-800 px-5 py-2 text-sm rounded-full">Cancel</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div key={prod.id} className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
                  <div className="h-48 bg-zinc-100 relative">
                     <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-900 leading-tight">{prod.title}</h3>
                      <div className="flex space-x-1 ml-2">
                        <button onClick={() => setIsEditingProduct(prod)} className="p-1 text-zinc-400 hover:text-slate-900"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => deleteProduct(prod.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">{categories.find(c => c.id === prod.categoryId)?.title}</p>
                    <p className="text-sm font-mono text-zinc-400 mt-auto">{prod.price ? `$${prod.price}` : ''}</p>
                  </div>
                </div>
              ))}
              {products.length === 0 && !isEditingProduct && (
                <div className="col-span-full py-12 text-center text-zinc-400 bg-white border border-zinc-100 rounded-3xl">No products found.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="max-w-5xl">
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight mb-8">Customer Messages</h1>
            <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">No messages yet.</div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {messages.map(msg => (
                    <div key={msg.id} className={`p-6 ${msg.status === 'new' ? 'bg-zinc-50' : 'bg-white'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-slate-900">{msg.name}</h3>
                          <div className="mt-1 space-y-1">
                            <a href={`mailto:${msg.email}`} className="text-sm text-slate-500 hover:text-slate-900 transition-colors block">{msg.email}</a>
                            {msg.phone && <a href={`tel:${msg.phone}`} className="text-sm text-slate-500 hover:text-slate-900 transition-colors block">{msg.phone}</a>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className="text-xs text-zinc-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                          <div className="flex space-x-2">
                            {msg.status === 'new' && (
                              <button onClick={() => markMessageAsRead(msg.id)} className="text-xs flex items-center space-x-1 text-slate-600 hover:text-slate-900 transition-colors">
                                <CheckCircle className="h-4 w-4" /> <span>Mark Read</span>
                              </button>
                            )}
                            <button onClick={() => deleteMessage(msg.id)} className="text-xs flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors">
                              <Trash2 className="h-4 w-4" /> <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-zinc-700 whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="max-w-5xl">
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight mb-8">Testimonials</h1>
            <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              {testimonials.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">No testimonials yet.</div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {testimonials.map(t => (
                    <div key={t.id} className={`p-6 ${t.status === 'pending' ? 'bg-zinc-50' : 'bg-white'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          {t.image && <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full mr-4 object-cover" />}
                          <div>
                            <h3 className="font-bold text-slate-900">{t.name} <span className="text-sm font-normal text-zinc-500">({t.role})</span></h3>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${t.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : t.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                              {t.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className="text-xs text-zinc-400">{new Date(t.createdAt).toLocaleDateString()}</span>
                          <div className="flex space-x-2">
                            {t.status === 'pending' && (
                              <>
                                <button onClick={() => updateTestimonialStatus(t.id, 'approved')} className="text-xs bg-slate-900 text-white px-3 py-1 rounded hover:bg-slate-800 transition-colors">
                                  Approve
                                </button>
                                <button onClick={() => updateTestimonialStatus(t.id, 'rejected')} className="text-xs border border-zinc-200 text-zinc-600 px-3 py-1 rounded hover:bg-zinc-50 transition-colors">
                                  Reject
                                </button>
                              </>
                            )}
                            {t.status === 'approved' && (
                               <button onClick={() => updateTestimonialStatus(t.id, 'rejected')} className="text-xs border border-zinc-200 text-zinc-600 px-3 py-1 rounded hover:bg-zinc-50 transition-colors">
                                 Revoke
                               </button>
                            )}
                            <button onClick={() => deleteTestimonial(t.id)} className="text-xs flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors ml-2 py-1">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-zinc-700 italic text-sm leading-relaxed">"{t.text}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl bg-white p-8 rounded-3xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight mb-8">Business Details</h1>
            <form onSubmit={saveSettings} className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Homepage Banner</h2>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Banner Title</label>
                <input type="text" name="bannerTitle" defaultValue={settings?.bannerTitle} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Banner Subtitle</label>
                <textarea name="bannerSubtitle" defaultValue={settings?.bannerSubtitle} rows={3} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Banner Image {uploadingImage && '(Uploading...)'}</label>
                {settings?.homeBannerImage && (
                  <div className="mt-2 mb-2">
                    <img src={settings.homeBannerImage} alt="Preview" className="h-32 object-cover rounded border border-zinc-200" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'homeBannerImage', true)} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" />
                <input type="hidden" name="homeBannerImage" value={settings?.homeBannerImage} />
              </div>

              <h2 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4 pt-4">Contact Info</h2>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Contact Phone</label>
                <input type="text" name="contactPhone" defaultValue={settings?.contactPhone} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Contact Email</label>
                <input type="email" name="contactEmail" defaultValue={settings?.contactEmail} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">Address</label>
                <input type="text" name="address" defaultValue={settings?.address} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">Instagram URL</label>
                <input type="text" name="instagramUrl" defaultValue={settings?.instagramUrl} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700">Youtube URL</label>
                <input type="text" name="youtubeUrl" defaultValue={settings?.youtubeUrl} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required />
              </div>
              
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4 pt-4">About Page</h2>
              <div>
                <label className="block text-sm font-medium text-zinc-700">About Title</label>
                <input type="text" name="aboutTitle" defaultValue={settings?.aboutTitle} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">About Subtitle</label>
                <textarea name="aboutSubtitle" defaultValue={settings?.aboutSubtitle} rows={3} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Hero Banner Image {uploadingImage && '(Uploading...)'}</label>
                {settings?.aboutBannerImage && (
                  <div className="mt-2 mb-2">
                    <img src={settings.aboutBannerImage} alt="Preview" className="h-32 object-cover rounded border border-zinc-200" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'aboutBannerImage', true)} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" />
                <input type="hidden" name="aboutBannerImage" value={settings?.aboutBannerImage} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Founder Image {uploadingImage && '(Uploading...)'}</label>
                {settings?.aboutFounderImage && (
                  <div className="mt-2 mb-2">
                    <img src={settings.aboutFounderImage} alt="Preview" className="h-32 object-cover rounded border border-zinc-200" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'aboutFounderImage', true)} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" />
                <input type="hidden" name="aboutFounderImage" value={settings?.aboutFounderImage} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Founder Story</label>
                <textarea name="aboutFounderStory" defaultValue={settings?.aboutFounderStory} rows={5} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required></textarea>
              </div>

              <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-full uppercase text-xs font-semibold tracking-widest hover:bg-slate-800 transition-colors mt-6">
                Save Changes
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
