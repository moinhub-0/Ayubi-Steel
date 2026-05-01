import { useState, useEffect } from 'react';
import { Settings, Image as ImageIcon, LayoutList, LogOut, Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';

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
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'categories' | 'products' | 'settings'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<GlobalSettings>({
    bannerTitle: 'Premium Metalwork for Modern Homes',
    bannerSubtitle: 'Industrial elegance combined with uncompromising durability.',
    contactPhone: '+91 785390 3438',
    contactEmail: 'info@ayubisteel.com'
  });

  const [isEditingCategory, setIsEditingCategory] = useState<Category | null>(null);
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', u.uid));
          setIsAdmin(adminDoc.exists());
        } catch (e) {
          console.error("Could not verify admin status", e);
          setIsAdmin(false);
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

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as GlobalSettings);
      }
    }, error => handleFirestoreError(error, OperationType.GET, 'settings/global'));

    return () => {
      unsubCats();
      unsubProds();
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

    const id = isEditingCategory?.id || crypto.randomUUID();
    const now = Date.now();
    try {
      await setDoc(doc(db, 'categories', id), {
        title,
        updatedAt: now,
        createdAt: isEditingCategory ? undefined : now // Let rules handle this correctly if needed, but for simplified setDoc with merge we pass it if new
      }, { merge: true });
      if(!isEditingCategory) {
          await setDoc(doc(db, 'categories', id), {
            title,
            updatedAt: now,
            createdAt: now
          });
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
    
    if (!title || !categoryId || !imageUrl || !description) return;

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
      if(!isEditingProduct) {
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

  const saveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      if (!settings) {
          await setDoc(doc(db, 'settings', 'global'), {
            bannerTitle: formData.get('bannerTitle'),
            bannerSubtitle: formData.get('bannerSubtitle'),
            contactPhone: formData.get('contactPhone'),
            contactEmail: formData.get('contactEmail'),
            updatedAt: Date.now()
          });
      } else {
          await setDoc(doc(db, 'settings', 'global'), {
            bannerTitle: formData.get('bannerTitle'),
            bannerSubtitle: formData.get('bannerSubtitle'),
            contactPhone: formData.get('contactPhone'),
            contactEmail: formData.get('contactEmail'),
            updatedAt: Date.now()
          }, { merge: true });
      }
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
        <div className="bg-white p-8 rounded-sm shadow-sm border border-zinc-200 w-full max-w-sm text-center">
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
        <nav className="flex-1 px-4 space-y-2 mt-8">
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
            <span>Products</span>
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setIsEditingCategory(null); setIsEditingProduct(null); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
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
        {activeTab === 'categories' && (
          <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Categories</h1>
              <button 
                onClick={() => setIsEditingCategory({ id: '', title: '' })}
                className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-sm hover:bg-slate-800 uppercase text-xs tracking-widest transition-colors"
                disabled={isEditingCategory !== null}
              >
                <Plus className="h-4 w-4" /> <span>Add Category</span>
              </button>
            </div>

            {isEditingCategory && (
              <form onSubmit={saveCategory} className="bg-white p-6 border border-zinc-200 mb-8 shadow-sm">
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
                  <button type="submit" className="bg-slate-900 text-white px-4 py-2 text-sm">Save</button>
                  <button type="button" onClick={() => setIsEditingCategory(null)} className="bg-zinc-200 text-zinc-800 px-4 py-2 text-sm">Cancel</button>
                </div>
              </form>
            )}

            <div className="bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-sm">
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
                className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-sm hover:bg-slate-800 uppercase text-xs tracking-widest transition-colors"
                disabled={isEditingProduct !== null}
              >
                <Plus className="h-4 w-4" /> <span>Add Product</span>
              </button>
            </div>

            {isEditingProduct && (
              <form onSubmit={saveProduct} className="bg-white p-6 border border-zinc-200 mb-8 shadow-sm">
                <h3 className="text-lg font-bold mb-4">{isEditingProduct.id ? 'Edit Product' : 'New Product'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Title</label>
                    <input type="text" name="title" defaultValue={isEditingProduct.title} className="w-full border border-zinc-300 p-2 focus:ring-slate-900 focus:border-slate-900" required />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Category</label>
                    <select name="categoryId" defaultValue={isEditingProduct.categoryId} className="w-full border border-zinc-300 p-2 focus:ring-slate-900 focus:border-slate-900" required>
                      <option value="">Select a category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-zinc-500 mb-1">Image URL</label>
                    <input type="url" name="imageUrl" defaultValue={isEditingProduct.imageUrl} placeholder="https://..." className="w-full border border-zinc-300 p-2 focus:ring-slate-900 focus:border-slate-900" required />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Price (Optional)</label>
                    <input type="number" name="price" defaultValue={isEditingProduct.price} className="w-full border border-zinc-300 p-2 focus:ring-slate-900 focus:border-slate-900" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-zinc-500 mb-1">Description</label>
                    <textarea name="description" defaultValue={isEditingProduct.description} rows={3} className="w-full border border-zinc-300 p-2 focus:ring-slate-900 focus:border-slate-900" required></textarea>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button type="submit" className="bg-slate-900 text-white px-4 py-2 text-sm">Save</button>
                  <button type="button" onClick={() => setIsEditingProduct(null)} className="bg-zinc-200 text-zinc-800 px-4 py-2 text-sm">Cancel</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div key={prod.id} className="bg-white border border-zinc-200 overflow-hidden shadow-sm flex flex-col">
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
                <div className="col-span-full py-12 text-center text-zinc-400 bg-white border border-zinc-200">No products found.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-8 border border-zinc-200 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight mb-8">Global Settings</h1>
            <form onSubmit={saveSettings} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700">Banner Title</label>
                <input type="text" name="bannerTitle" defaultValue={settings?.bannerTitle} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Banner Subtitle</label>
                <textarea name="bannerSubtitle" defaultValue={settings?.bannerSubtitle} rows={3} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Contact Phone</label>
                <input type="text" name="contactPhone" defaultValue={settings?.contactPhone} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Contact Email</label>
                <input type="email" name="contactEmail" defaultValue={settings?.contactEmail} className="mt-1 block w-full border-zinc-300 p-2 border focus:ring-slate-900 focus:border-slate-900 sm:text-sm" required />
              </div>
              <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-sm uppercase text-xs font-semibold tracking-widest hover:bg-slate-800 transition-colors">
                Save Changes
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
