'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  AlertOctagon, 
  CheckCircle,
  Tag,
  Star,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  type: string;
  status: 'In Stock' | 'Out Of Stock' | 'Few Left';
  promo?: boolean;
  flashSale?: boolean;
  oldPrice?: number;
  newPrice?: number;
  topSelling?: boolean;
  featured?: boolean;
  sponsored?: boolean;
  image?: string;
  colors?: string[];
  sizes?: string[];
}

export default function AdminProductsPage() {
  // Initial inventory mock data
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('active-wear');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('shirt');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [oldPrice, setOldPrice] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [isTopSelling, setIsTopSelling] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [status, setStatus] = useState<'In Stock' | 'Out Of Stock' | 'Few Left'>('In Stock');

  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  // Open add product modal
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingProductId(null);
    setName('');
    setCategory('active-wear');
    setPrice('');
    setType('shirt');
    setIsPromo(false);
    setIsFlashSale(false);
    setOldPrice('');
    setNewPrice('');
    setIsTopSelling(false);
    setIsFeatured(false);
    setIsSponsored(false);
    setStatus('In Stock');
    setImageFile(null);
    setColors([]);
    setSizes([]);
    setColorInput('');
    setSizeInput('');
    setIsModalOpen(true);
  };

  // Open edit product modal
  const handleStartEdit = (prod: ProductItem) => {
    setIsEditing(true);
    setEditingProductId(prod.id);
    setName(prod.name);
    setCategory(prod.category);
    setPrice(String(prod.price));
    setType(prod.type);
    setIsPromo(!!prod.promo);
    setIsFlashSale(!!prod.flashSale);
    setOldPrice(prod.oldPrice ? String(prod.oldPrice) : '');
    setNewPrice(prod.newPrice ? String(prod.newPrice) : '');
    setIsTopSelling(!!prod.topSelling);
    setIsFeatured(!!prod.featured);
    setIsSponsored(!!prod.sponsored);
    setStatus(prod.status);
    setImageFile(null);
    setColors(prod.colors || []);
    setSizes(prod.sizes || []);
    setColorInput('');
    setSizeInput('');
    setIsModalOpen(true);
  };

  // Filter tab state
  const [activeTab, setActiveTab] = useState('all');

  // Load products from API on mount
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Handle Add/Edit Product Submission
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    let uploadedImageUrl = undefined;
    if (imageFile) {
      setUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          uploadedImageUrl = uploadData.url;
        } else {
          alert('Failed to upload image to storage: ' + uploadData.message);
          setUploadingImage(false);
          return;
        }
      } catch (error) {
        console.error('Image upload exception:', error);
        alert('Image upload failed.');
        setUploadingImage(false);
        return;
      } finally {
        setUploadingImage(false);
      }
    }

    try {
      const url = isEditing ? `/api/products/${editingProductId}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const payload: any = {
        name,
        category,
        price: Number(price),
        type,
        promo: isPromo,
        flashSale: isFlashSale,
        oldPrice: isFlashSale && oldPrice ? Number(oldPrice) : undefined,
        newPrice: isFlashSale && newPrice ? Number(newPrice) : undefined,
        topSelling: isTopSelling,
        featured: isFeatured,
        sponsored: isSponsored,
        status: status,
        colors,
        sizes
      };

      if (uploadedImageUrl) {
        payload.image = uploadedImageUrl;
      } else if (isEditing) {
        const currentProd = products.find(p => p.id === editingProductId);
        if (currentProd) payload.image = currentProd.image;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        if (isEditing) {
          setProducts(prev => prev.map(p => p.id === editingProductId ? data.product : p));
        } else {
          setProducts(prev => [data.product, ...prev]);
        }
        setIsModalOpen(false);
      } else {
        alert(data.message || 'Failed to save product.');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to connect to the server.');
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (prodId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${prodId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== prodId));
      } else {
        alert(data.message || 'Failed to delete product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Update product stock status
  const handleUpdateProductStatus = async (prodId: string, newStatus: 'In Stock' | 'Out Of Stock' | 'Few Left') => {
    try {
      const res = await fetch(`/api/products/${prodId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => {
          if (p.id === prodId) {
            return {
              ...p,
              status: newStatus
            };
          }
          return p;
        }));
      } else {
        alert(data.message || 'Failed to update product status.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/60 p-2 rounded-2xl text-violet-650 dark:text-violet-400">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Products Inventory</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Add new wardrobe collections and toggle product active/flagged status.</p>
          </div>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-50 dark:hover:bg-zinc-150 text-white dark:text-zinc-900 font-bold text-xs px-5 py-3.5 rounded-2xl transition duration-150 shadow-md cursor-pointer self-start md:self-center"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Add New Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.93, y: 15, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1,
                transition: { type: 'spring', stiffness: 280, damping: 24 }
              }}
              exit={{ 
                scale: 0.95, 
                y: 10, 
                opacity: 0, 
                transition: { duration: 0.15 } 
              }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4"
            >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <h2 className="text-sm font-extrabold text-zinc-850 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                  <Plus size={16} className="text-violet-650 dark:text-violet-400" />
                  {isEditing ? 'Edit Product Settings' : 'Add New Product'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-450 dark:text-zinc-400 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitProduct} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block" htmlFor="prod-name">Product Name</label>
                    <input
                      id="prod-name"
                      type="text"
                      required
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-3.5 py-3 text-xs text-zinc-900 dark:text-zinc-55 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 transition duration-150"
                      placeholder="e.g. Linen Wrap Jacket"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block" htmlFor="prod-price">Price ($)</label>
                    <input
                      id="prod-price"
                      type="number"
                      required
                      min="1"
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-3.5 py-3 text-xs text-zinc-900 dark:text-zinc-55 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 transition duration-150"
                      placeholder="e.g. 120"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block" htmlFor="prod-category">Category Archive</label>
                    <select
                      id="prod-category"
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-3.5 py-3 text-xs text-zinc-900 dark:text-zinc-55 outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 transition duration-150 cursor-pointer"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="active-wear">Active Wear</option>
                      <option value="travel-set">Travel Set</option>
                      <option value="lounge-wear">Lounge Wear</option>
                      <option value="footwear">Foot Wear</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block" htmlFor="prod-status">Inventory Status</label>
                    <select
                      id="prod-status"
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-3.5 py-3 text-xs text-zinc-900 dark:text-zinc-55 outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 transition duration-150 cursor-pointer"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Few Left">Few Left</option>
                      <option value="Out Of Stock">Out Of Stock</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block mb-1.5" htmlFor="prod-image">Product Image File</label>
                    <div className="relative border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-violet-500 dark:hover:border-violet-400 rounded-2xl p-5 transition duration-155 flex flex-col items-center justify-center gap-1.5 bg-slate-50 dark:bg-zinc-950 cursor-pointer">
                      <input
                        id="prod-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <ShoppingBag className="w-6 h-6 text-zinc-400 dark:text-zinc-650" />
                      <span className="text-xs text-zinc-650 dark:text-zinc-350 font-bold max-w-[280px] truncate text-center">
                        {imageFile ? imageFile.name : 'Select or drag product image'}
                      </span>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 tracking-wider uppercase font-semibold">PNG, JPG, WEBP formats</span>
                    </div>
                  </div>

                  {/* Colors Input */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">Available Colors</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-55 outline-none focus:ring-2 focus:ring-violet-500/25"
                        placeholder="Type color e.g. Black"
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (colorInput.trim() && !colors.includes(colorInput.trim())) {
                              setColors([...colors, colorInput.trim()]);
                              setColorInput('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (colorInput.trim() && !colors.includes(colorInput.trim())) {
                            setColors([...colors, colorInput.trim()]);
                            setColorInput('');
                          }
                        }}
                        className="bg-zinc-900 hover:bg-zinc-805 dark:bg-zinc-50 dark:hover:bg-zinc-150 text-white dark:text-zinc-900 px-4 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    {colors.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-zinc-950/65 rounded-xl border border-zinc-150 dark:border-zinc-800/40">
                        {colors.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1 bg-pink-50 dark:bg-pink-955/25 text-pink-700 dark:text-pink-400 border border-pink-100 dark:border-pink-900/60 px-2 py-0.5 rounded-lg text-[10px] font-bold"
                          >
                            <span>{c}</span>
                            <button
                              type="button"
                              onClick={() => setColors(colors.filter((x) => x !== c))}
                              className="text-pink-650 hover:text-pink-850 dark:text-pink-400 font-bold transition-colors cursor-pointer"
                            >
                              <X size={10} className="stroke-[2.5]" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sizes Input */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">Available Sizes</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-55 outline-none focus:ring-2 focus:ring-violet-500/25"
                        placeholder="Type size e.g. M, L, 42"
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
                              setSizes([...sizes, sizeInput.trim()]);
                              setSizeInput('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
                            setSizes([...sizes, sizeInput.trim()]);
                            setSizeInput('');
                          }
                        }}
                        className="bg-zinc-900 hover:bg-zinc-805 dark:bg-zinc-50 dark:hover:bg-zinc-150 text-white dark:text-zinc-900 px-4 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    {sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-zinc-950/65 rounded-xl border border-zinc-150 dark:border-zinc-800/40">
                        {sizes.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 bg-violet-50 dark:bg-violet-955/25 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-900/60 px-2 py-0.5 rounded-lg text-[10px] font-bold"
                          >
                            <span>{s}</span>
                            <button
                              type="button"
                              onClick={() => setSizes(sizes.filter((x) => x !== s))}
                              className="text-violet-650 hover:text-violet-850 dark:text-violet-400 font-bold transition-colors cursor-pointer"
                            >
                              <X size={10} className="stroke-[2.5]" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Checkboxes settings */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-4">
                  <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">Product Settings & Badges</span>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsTopSelling(!isTopSelling)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer border ${
                        isTopSelling 
                          ? 'bg-amber-50 dark:bg-amber-955/20 border-amber-300 dark:border-amber-900/60 text-amber-700 dark:text-amber-400' 
                          : 'bg-slate-50 dark:bg-zinc-955/20 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-455'
                      }`}
                    >
                      <span className="text-[10px]">Top Selling</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsFeatured(!isFeatured)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer border ${
                        isFeatured 
                          ? 'bg-violet-50 dark:bg-violet-955/20 border-violet-300 dark:border-violet-900/60 text-violet-700 dark:text-violet-400' 
                          : 'bg-slate-50 dark:bg-zinc-955/20 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-455'
                      }`}
                    >
                      <span className="text-[10px]">Featured</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsSponsored(!isSponsored)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer border ${
                        isSponsored 
                          ? 'bg-blue-50 dark:bg-blue-955/20 border-blue-300 dark:border-blue-900/60 text-blue-700 dark:text-blue-400' 
                          : 'bg-slate-50 dark:bg-zinc-955/20 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-455'
                      }`}
                    >
                      <span className="text-[10px]">Sponsored</span>
                    </button>
                  </div>

                  <div className="space-y-3.5 border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsFlashSale(!isFlashSale)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer border ${
                        isFlashSale 
                          ? 'bg-rose-50 dark:bg-rose-955/20 border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-450' 
                          : 'bg-slate-50 dark:bg-zinc-955/20 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-455'
                      }`}
                    >
                      <span>Flash Sale Offer</span>
                    </button>

                    <AnimatePresence>
                      {isFlashSale && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="grid grid-cols-2 gap-3 mt-2 overflow-hidden"
                        >
                          <div className="space-y-1.5 pb-2">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block" htmlFor="old-price">Old Price ($)</label>
                            <input
                              id="old-price"
                              type="number"
                              required={isFlashSale}
                              min="1"
                              className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-3 py-2.5 text-xs text-zinc-900 dark:text-zinc-55 outline-none focus:ring-1 focus:ring-rose-550"
                              placeholder="e.g. 340"
                              value={oldPrice}
                              onChange={(e) => setOldPrice(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5 pb-2">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block" htmlFor="new-price">New Price ($)</label>
                            <input
                              id="new-price"
                              type="number"
                              required={isFlashSale}
                              min="1"
                              className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-3 py-2.5 text-xs text-zinc-900 dark:text-zinc-55 outline-none focus:ring-1 focus:ring-rose-550"
                              placeholder="e.g. 240"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              {/* Modal Actions */}
              <div className="flex gap-3 border-t border-zinc-150 dark:border-zinc-800/80 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-300 font-bold text-xs py-3 rounded-xl transition cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-50 dark:hover:bg-zinc-150 text-white dark:text-zinc-900 font-bold text-xs py-3 rounded-xl transition cursor-pointer text-center disabled:opacity-50"
                >
                  {uploadingImage ? 'Uploading Image...' : isEditing ? 'Save Changes' : 'Add Product'}
                </button>
              </div>

            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2.5 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        {['all', 'active-wear', 'travel-set', 'lounge-wear', 'footwear'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === tab
                ? "bg-violet-600 dark:bg-violet-400 text-white dark:text-zinc-950"
                : "bg-white dark:bg-zinc-900 text-zinc-550 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            {tab === 'all' ? 'All Archive' : tab}
          </button>
        ))}
      </div>

      {/* Products Table List */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm backdrop-blur-sm transition duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest bg-zinc-50/20 dark:bg-zinc-900/10">
                <th className="px-6 py-3.5">Product Title</th>
                <th className="px-6 py-3.5">Category Archive</th>
                <th className="px-6 py-3.5">Rating</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-550 dark:text-zinc-400">
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-violet-650 border-t-transparent" />
                      <span className="text-xs font-semibold">Loading product database...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-zinc-50 dark:bg-zinc-950 overflow-hidden flex-shrink-0 border border-zinc-200/50 dark:border-zinc-800/80 flex items-center justify-center">
                          {prod.image ? (
                            <img src={prod.image} alt={prod.name} className="h-full w-full object-cover" />
                          ) : (
                            <ShoppingBag className="w-4 h-4 text-zinc-400 dark:text-zinc-650" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-55">{prod.name}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                          {prod.featured && (
                            <span className="text-[8px] font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-955/20 border border-violet-100 dark:border-violet-900/60 px-1.5 py-0.5 rounded-md shadow-xs">
                              Featured
                            </span>
                          )}
                          {prod.topSelling && (
                            <span className="text-[8px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-955/20 border border-amber-100 dark:border-amber-900/60 px-1.5 py-0.5 rounded-md shadow-xs">
                              Top Selling
                            </span>
                          )}
                          {prod.promo && (
                            <span className="text-[8px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-955/20 border border-emerald-100 dark:border-emerald-900/60 px-1.5 py-0.5 rounded-md shadow-xs">
                              Promo
                            </span>
                          )}
                          {prod.sponsored && (
                            <span className="text-[8px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-955/20 border border-blue-100 dark:border-blue-900/60 px-1.5 py-0.5 rounded-md shadow-xs">
                              Sponsored
                            </span>
                          )}
                          {prod.flashSale && (
                            <span className="text-[8px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-450 bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/60 px-1.5 py-0.5 rounded-md shadow-xs">
                              Flash Sale (${prod.oldPrice} → ${prod.newPrice})
                            </span>
                          )}
                          {prod.sizes && prod.sizes.length > 0 && (
                            <span className="text-[9px] text-zinc-400 dark:text-zinc-550 font-semibold block mt-1.5">
                              Sizes: {prod.sizes.join(', ')}
                            </span>
                          )}
                          {prod.colors && prod.colors.length > 0 && (
                            <span className="text-[9px] text-zinc-400 dark:text-zinc-550 font-semibold block">
                              Colors: {prod.colors.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-650 dark:text-zinc-350 bg-slate-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 px-2 py-0.5 rounded-lg shadow-sm">
                        <Tag size={10} />
                        {prod.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-350">{prod.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-zinc-900 dark:text-zinc-55 font-mono">
                      ${prod.price}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={prod.status}
                        onChange={(e) => handleUpdateProductStatus(prod.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border cursor-pointer outline-none transition duration-150 uppercase tracking-wider ${
                          prod.status === 'In Stock'
                            ? 'bg-emerald-50 dark:bg-emerald-955/20 border-emerald-250 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-extrabold'
                            : prod.status === 'Few Left'
                            ? 'bg-amber-50 dark:bg-amber-955/25 border-amber-250 dark:border-amber-900/60 text-amber-650 dark:text-amber-400 font-extrabold'
                            : 'bg-rose-50 dark:bg-rose-955/25 border-rose-250 dark:border-rose-900/60 text-rose-600 dark:text-rose-450 font-extrabold'
                        }`}
                      >
                        <option value="In Stock" className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">In Stock</option>
                        <option value="Few Left" className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">Few Left</option>
                        <option value="Out Of Stock" className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">Out Of Stock</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleStartEdit(prod)}
                          className="font-semibold px-3 py-1.5 rounded-lg text-xs transition duration-150 cursor-pointer border border-transparent hover:border-amber-200 dark:hover:border-amber-900/60 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-350"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-rose-600 hover:text-rose-800 dark:text-rose-450 dark:hover:text-rose-350 hover:bg-rose-50 dark:hover:bg-rose-955/20 font-semibold px-3 py-1.5 rounded-lg text-xs transition duration-150 cursor-pointer flex items-center gap-1 border border-transparent hover:border-rose-250 dark:hover:border-rose-900/60"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="p-8 text-center text-zinc-550 dark:text-zinc-400">
            <ShoppingBag className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="text-xs font-semibold">No products found in this archive.</p>
          </div>
        )}
      </div>

    </main>
  );
}
