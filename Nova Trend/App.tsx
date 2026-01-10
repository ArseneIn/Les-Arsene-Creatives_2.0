import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
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
import ProtectedRoute from './components/layout/ProtectedRoute';
import NotificationMonitor from './components/ui/NotificationMonitor';
import CookieConsentBanner from './components/ui/CookieConsentBanner';
import NovaLogo from './components/ui/NovaLogo';
import { AuthProvider, useAuth } from './components/context/AuthContext';
import { CartProvider, useCart } from './components/context/CartContext';
import { ThemeProvider } from './components/context/ThemeContext';
import { ShopProvider } from './components/context/ShopContext';
import { NotificationProvider } from './components/context/NotificationContext';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from './types';

// Wrapper component to handle layout and initial loading state
const AppLayout: React.FC = () => {
  const { isInitializing } = useAuth();
  const { cart, removeFromCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const { userProfile } = useAuth(); // Monitor for logs if needed
  const navigate = useNavigate();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative animate-pulse">
          <NovaLogo variant="mark" theme="dark" size={80} className="mb-10" />
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-black text-nova-orange uppercase tracking-[0.6em]">Registry Core Syncing</span>
            <div className="flex gap-1.5 opacity-40">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-75" />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-150" />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-300" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-nova-orange transition-colors duration-500 flex flex-col">
      <Header />

      <main className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/best-sellers" element={<BestSellers />} />
          <Route path="/gaming" element={<GamingLaptops />} />
          <Route path="/business" element={<BusinessLaptops />} />
          <Route path="/limited-deals" element={<LimitedDeals />} />
          <Route path="/comparison-tool" element={<ComparisonTool />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/cookies" element={<CookiesPolicy />} />
          <Route path="/about" element={<AboutUs />} />

          <Route path="/policies/:type" element={<Policies />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/track/:id" element={<TrackOrder />} />

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute isAuthenticated={localStorage.getItem('isAdmin') === 'true'} fallbackPage="/login">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute isAuthenticated={localStorage.getItem('isClient') === 'true'} fallbackPage="/login">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute isAuthenticated={localStorage.getItem('isClient') === 'true'} fallbackPage="/login">
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <NotificationMonitor />
      <CookieConsentBanner />

      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border-l border-white/5 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-extrabold flex items-center gap-3 text-white uppercase italic">
                <ShoppingBag className="text-nova-orange" /> Registry Cart
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-500"><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 animate-in slide-in-from-right-4 duration-300">
                  <img src={item.image} className="w-24 h-24 rounded-[20px] object-cover border border-white/10" alt="" />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-black text-white text-sm uppercase italic leading-tight">{item.name}</h4>
                    <div className="text-nova-orange font-black text-lg">${item.price.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Qty: {item.quantity} Nodes</div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-red-500 self-start transition-colors"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
              {cart.length === 0 && <div className="text-center py-32 text-slate-600 font-black uppercase tracking-[0.4em] italic opacity-40">Cart Nodes Empty</div>}
            </div>
            {cart.length > 0 && (
              <div className="p-8 border-t border-white/10 bg-black/20">
                <div className="flex justify-between items-baseline mb-8">
                  <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Fleet Total</span>
                  <span className="text-4xl font-black text-white italic tracking-tighter">${cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                  className="w-full bg-nova-orange py-6 rounded-[24px] font-black uppercase text-white flex items-center justify-center gap-3 hover:bg-nova-hover transition-all shadow-xl shadow-orange-900/20 active:scale-95"
                >
                  Secure Deployment <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <ShopProvider>
                <AppLayout />
              </ShopProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;