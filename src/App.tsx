import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Products from './pages/Products';
import LoginForm from './components/LoginForm';
import CheckoutForm from './components/CheckoutForm';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar onCartClick={() => setIsCartOpen(true)} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        
        <main className="pt-16">
          {!user && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <LoginForm />
            </div>
          )}
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/checkout" element={<CheckoutForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;