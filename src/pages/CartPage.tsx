
import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, getCartTotal } = useStore();
  
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <ShoppingCart className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="mb-6 text-gray-600">Add some products to your cart!</p>
        <Button asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartItemQuantity(productId, newQuantity);
  };
  
  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Product Image */}
                  <div className="sm:w-32 h-32 flex-shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-grow p-4 flex flex-col sm:flex-row justify-between">
                    <div className="flex-grow">
                      <Link to={`/products/${item.product.id}`} className="text-lg font-medium hover:text-teal-600">
                        {item.product.name}
                      </Link>
                      <p className="text-gray-600 line-clamp-2 mt-1">
                        {item.product.description}
                      </p>
                      <p className="font-bold text-teal-600 mt-2">
                        R${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4 sm:mt-0 sm:ml-6">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-red-500 ml-4"
                        onClick={() => handleRemove(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-teal-600">R${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700">
                Proceed to Checkout
              </Button>
              
              <div className="mt-4">
                <Link 
                  to="/products" 
                  className="text-center block text-sm text-teal-600 hover:text-teal-800"
                >
                  Continue Shopping
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
