
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Policies from './pages/Policies';
import TrackOrder from './pages/TrackOrder';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import BestSellers from './pages/BestSellers';
import GamingLaptops from './pages/GamingLaptops';
import BusinessLaptops from './pages/BusinessLaptops';
import LimitedDeals from './pages/LimitedDeals';
import ComparisonTool from './pages/ComparisonTool';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import CookiesPolicy from './pages/CookiesPolicy';
import LoginPage from './pages/LoginPage';
import ProductDetail from './pages/ProductDetail';
import AboutUs from './pages/AboutUs';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationMonitor from './components/NotificationMonitor';
import CookieConsentBanner from './components/CookieConsentBanner';
import { Product, CartItem, FilterState } from './types';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState<any>(null);
  const [policyType, setPolicyType] = useState<'shipping' | 'returns' | 'warranty'>('shipping');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [comparingProducts, setComparingProducts] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(() => localStorage.getItem('isClient') === 'true');
  const [clientName, setClientName] = useState(() => localStorage.getItem('clientName') || 'Arsene Cyuzuzo');
  
  const [lastOrder, setLastOrder] = useState<{ id: string; items: CartItem[]; customerName?: string; phone?: string } | null>(null);
  const [notificationLogs, setNotificationLogs] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([
    { id: '1001', customer: 'Arsene Cyuzuzo', product: 'MacBook Pro 14', category: 'Software/OS Setup', priority: 'High', status: 'In Review', description: 'Screen flickering after macOS update.' }
  ]);

  const logNotification = useCallback((type: string, message: string) => {
    const newLog = { id: Math.random().toString(36).substr(2, 9), type, message, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setNotificationLogs(prev => [newLog, ...prev].slice(0, 3));
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    setPageParams(params || null);
    if (['shipping', 'returns', 'warranty'].includes(page)) {
      setPolicyType(page as any);
      setCurrentPage('policies');
    } else if (page === 'login') {
      if (isAuthenticated) setCurrentPage('admin');
      else if (isClientAuthenticated) setCurrentPage('client-dashboard');
      else setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isClient');
    localStorage.removeItem('clientName');
    setIsAuthenticated(false);
    setIsClientAuthenticated(false);
    setCurrentPage('home');
  };

  const handleLoginSuccess = (role: 'admin' | 'client', name?: string) => {
    if (role === 'admin') {
      localStorage.setItem('isAdmin', 'true');
      setIsAuthenticated(true);
      setCurrentPage('admin');
    } else {
      localStorage.setItem('isClient', 'true');
      if (name) { localStorage.setItem('clientName', name); setClientName(name); }
      setIsClientAuthenticated(true);
      setCurrentPage('client-dashboard');
    }
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Home onAddToCart={addToCart} onQuickView={setQuickViewProduct} onCompareToggle={toggleCompare} onNavigate={handleNavigate} comparingIds={comparingProducts.map(p => p.id)} />;
      case 'best-sellers': return <BestSellers onAddToCart={addToCart} onQuickView={setQuickViewProduct} />;
      case 'gaming': return <GamingLaptops onAddToCart={addToCart} onQuickView={setQuickViewProduct} />;
      case 'business': return <BusinessLaptops onAddToCart={addToCart} onQuickView={setQuickViewProduct} />;
      case 'limited-deals': return <LimitedDeals onAddToCart={addToCart} onQuickView={setQuickViewProduct} />;
      case 'comparison-tool': return <ComparisonTool onAddToCart={addToCart} />;
      case 'privacy': return <PrivacyPolicy onBack={() => setCurrentPage('home')} />;
      case 'terms': return <TermsOfUse onBack={() => setCurrentPage('home')} />;
      case 'cookies': return <CookiesPolicy onBack={() => setCurrentPage('home')} />;
      case 'login': return <LoginPage onLoginSuccess={handleLoginSuccess} onBackToHome={() => setCurrentPage('home')} />;
      case 'admin': return <ProtectedRoute isAuthenticated={isAuthenticated} fallbackPage="login" onRedirect={setCurrentPage}><AdminDashboard onLogout={handleLogout} supportTickets={supportTickets} /></ProtectedRoute>;
      case 'client-dashboard': return <ClientDashboard onLogout={handleLogout} onNavigate={handleNavigate} customerName={clientName} onSubmitTicket={(t) => setSupportTickets(prev => [t, ...prev])} />;
      case 'checkout': return <Checkout cart={cart} onComplete={(orderId, customerData) => {
        setLastOrder({ 
          id: orderId, 
          items: [...cart], 
          customerName: customerData.name, 
          phone: customerData.phone 
        });
        setCart([]);
        setCurrentPage('order-success');
      }} onBack={() => setCurrentPage('home')} />;
      case 'policies': return <Policies type={policyType} />;
      case 'track': return <TrackOrder onStatusUpdate={logNotification} externalOrderId={pageParams?.id} />;
      case 'order-success': return lastOrder ? <OrderSuccess orderId={lastOrder.id} cart={lastOrder.items} customerName={lastOrder.customerName} phoneNumber={lastOrder.phone} onTrack={() => handleNavigate('track', { id: lastOrder.id })} onContinue={() => setCurrentPage('home')} /> : null;
      case 'detail': return pageParams ? <ProductDetail product={pageParams} onAddToCart={addToCart} onBack={() => setCurrentPage('home')} /> : null;
      case 'about': return <AboutUs onBack={() => setCurrentPage('home')} onContact={() => handleNavigate('track')} />;
      default: return null;
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const toggleCompare = (product: Product) => setComparingProducts(prev => prev.find(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : prev.length >= 2 ? [prev[1], product] : [...prev, product]);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isWhiteBgPage = ['policies', 'best-sellers', 'business', 'limited-deals', 'comparison-tool', 'privacy', 'terms', 'cookies', 'client-dashboard', 'detail', 'about', 'order-success'].includes(currentPage);

  return (
    <div className={`min-h-screen ${isWhiteBgPage ? 'bg-white' : 'bg-black'} text-white selection:bg-orange-600 selection:text-white transition-colors duration-500`}>
      <Header cartCount={cart.reduce((a, b) => a + b.quantity, 0)} onCartClick={() => setIsCartOpen(true)} onNavigate={handleNavigate} />
      <main>{renderPage()}</main>
      <NotificationMonitor logs={notificationLogs} />
      <CookieConsentBanner />
      {comparingProducts.length > 0 && currentPage !== 'comparison-tool' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 border border-orange-600/30 px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10 backdrop-blur-xl pointer-events-auto">
          <div className="flex -space-x-3">{comparingProducts.map(p => <img key={p.id} src={p.image} className="w-10 h-10 rounded-full border-2 border-zinc-900 object-cover" alt="" />)}</div>
          <button onClick={() => setCurrentPage('comparison-tool')} className="text-sm font-black uppercase tracking-widest text-orange-500">Launch Matrix ({comparingProducts.length})</button>
          <button onClick={() => setComparingProducts([])} className="p-1 hover:bg-zinc-800 rounded-full text-zinc-500"><X className="w-4 h-4" /></button>
        </div>
      )}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50"><h2 className="text-xl font-extrabold flex items-center gap-2"><ShoppingBag className="text-orange-600" /> Your Cart</h2><button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-zinc-800 rounded-full"><X /></button></div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4"><img src={item.image} className="w-20 h-20 rounded-lg object-cover border border-zinc-800" alt="" /><div className="flex-1"><h4 className="font-bold text-white text-sm">{item.name}</h4><div className="text-orange-500 font-extrabold">${item.price.toLocaleString()}</div><div className="text-xs text-zinc-500">Qty: {item.quantity}</div></div><button onClick={() => removeFromCart(item.id)} className="text-zinc-700 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div>
              ))}
              {cart.length === 0 && <div className="text-center py-20 text-zinc-600 font-bold uppercase tracking-widest italic">Cart is empty</div>}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-800 bg-zinc-900/50"><div className="flex justify-between mb-4"><span className="text-zinc-500 font-bold">Total</span><span className="text-2xl font-black">${cartTotal.toLocaleString()}</span></div><button onClick={() => { setIsCartOpen(false); setCurrentPage('checkout'); }} className="w-full bg-orange-600 py-4 rounded-xl font-black uppercase flex items-center justify-center gap-2">Checkout <ArrowRight /></button></div>
            )}
          </div>
        </div>
      )}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setQuickViewProduct(null)} />
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-20 p-2 bg-black/40 rounded-full text-white"><X /></button>
            <div className="md:w-1/2 h-64 md:h-auto"><img src={quickViewProduct.image} className="w-full h-full object-cover" alt="" /></div>
            <div className="md:w-1/2 p-8 overflow-y-auto">
              <span className="text-xs font-black text-orange-500 uppercase tracking-widest">{quickViewProduct.brand}</span>
              <h2 className="text-3xl font-extrabold text-white mb-6 uppercase italic">{quickViewProduct.name}</h2>
              <div className="text-3xl font-black text-orange-600 mb-8">${quickViewProduct.price.toLocaleString()}</div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-900 p-3 rounded-xl">
                  <div className="text-[10px] text-zinc-600 uppercase font-black mb-1">Processor</div>
                  <div className="text-xs text-white font-bold">{quickViewProduct.technical_specs.cpu_brand} {quickViewProduct.technical_specs.cpu_model}</div>
                </div>
                <div className="bg-zinc-900 p-3 rounded-xl">
                  <div className="text-[10px] text-zinc-600 uppercase font-black mb-1">Memory</div>
                  <div className="text-xs text-white font-bold">{quickViewProduct.technical_specs.memory}</div>
                </div>
                <div className="bg-zinc-900 p-3 rounded-xl">
                  <div className="text-[10px] text-zinc-600 uppercase font-black mb-1">Display</div>
                  <div className="text-xs text-white font-bold">{quickViewProduct.technical_specs.display?.size} {quickViewProduct.technical_specs.display?.panel}</div>
                </div>
                <div className="bg-zinc-900 p-3 rounded-xl">
                  <div className="text-[10px] text-zinc-600 uppercase font-black mb-1">Storage</div>
                  <div className="text-xs text-white font-bold">{quickViewProduct.technical_specs.storage}</div>
                </div>
              </div>
              <button onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }} className="w-full bg-orange-600 text-white font-extrabold py-4 rounded-xl flex items-center justify-center gap-2"><ShoppingBag /> Add to Cart</button>
            </div>
          </div>
        </div>
      )}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
