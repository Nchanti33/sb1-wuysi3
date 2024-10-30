import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface OrderDetails {
  _id: string;
  totalPrice: number;
  status: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    product: {
      name: string;
      image: string;
    };
    quantity: number;
    price: number;
  }>;
}

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError('Unable to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600">{error || 'Order not found'}</p>
        <Link to="/" className="text-green-600 hover:underline mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Commande Confirmée!</h1>
          <p className="text-gray-600 mt-2">Numéro de commande: {order._id}</p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold mb-4">Détails de la commande</h2>
          
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-16 w-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-gray-600">
                    Quantité: {item.quantity} × {item.price}€
                  </p>
                </div>
                <p className="font-semibold">
                  {(item.quantity * item.price).toFixed(2)}€
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-6 pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{order.totalPrice.toFixed(2)}€</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Adresse de livraison</h3>
            <p className="text-gray-600">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/orders"
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
            >
              Voir mes commandes
            </Link>
            <Link
              to="/"
              className="border-2 border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition-colors"
            >
              Continuer les achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}