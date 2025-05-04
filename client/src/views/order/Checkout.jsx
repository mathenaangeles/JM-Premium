import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaSpinner } from 'react-icons/fa';

import { getCart } from '../../slices/cartSlice';
import SelectAddress from '../address/SelectAddress';
import { processPayment } from '../../slices/paymentSlice';
import { getUserAddresses } from '../../slices/addressSlice';
import { createOrder, payOrder } from '../../slices/orderSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cart } = useSelector((state) => state.cart);
  const { loading, error, success, order } = useSelector((state) => state.order);
  const { addresses } = useSelector((state) => state.address);
  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    country_code: '',
    phone_number: '',
    shipping_address_id: '',
    shipping_line_1: '',
    shipping_line_2: '',
    shipping_city: '',
    shipping_zip_code: '',
    shipping_country: '',
    billing_address_id: '',
    billing_line_1: '',
    billing_line_2: '',
    billing_city: '',
    billing_zip_code: '',
    billing_country: '',
    shipping_method: 'standard',
    payment_method: 'credit_card',
    same_as_shipping: true,
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [showShippingAddressList, setShowShippingAddressList] = useState(false);
  const [showBillingAddressList, setShowBillingAddressList] = useState(false);
  const [isGuestCheckout, _ ] = useState(!user);
  
  useEffect(() => {
    dispatch(getCart());
    if (user) {
      dispatch(getUserAddresses());
    }
  }, [dispatch, user]);
  
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.is_default) || addresses[0];
      setFormData(prev => ({
        ...prev,
        shipping_address_id: defaultAddress.id || '',
        shipping_line_1: defaultAddress.line_1 || '',
        shipping_line_2: defaultAddress.line_2 || '',
        shipping_city: defaultAddress.city || '',
        shipping_zip_code: defaultAddress.zip_code || '',
        shipping_country: defaultAddress.country || '',
      }));
    }
  }, [addresses]);
  
  useEffect(() => {
    if (formData.same_as_shipping) {
      setFormData(prev => ({
        ...prev,
        billing_address_id: prev.shipping_address_id,
        billing_line_1: prev.shipping_line_1,
        billing_line_2: prev.shipping_line_2,
        billing_city: prev.shipping_city,
        billing_zip_code: prev.shipping_zip_code,
        billing_country: prev.shipping_country,
      }));
    }
  }, [
    formData.shipping_address_id, 
    formData.shipping_line_1, 
    formData.shipping_line_2, 
    formData.shipping_city, 
    formData.shipping_zip_code, 
    formData.shipping_country,
    formData.same_as_shipping
  ]);
  
  useEffect(() => {
    if (success && order) {
        if (!user && formData.email) {
            localStorage.setItem('guestEmail', formData.email);
        }
        navigate(`/orders/${order.id}`);
    }
  }, [success, order, navigate, formData.email, user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleAddressSelection = (type, address) => {
    if (type === 'shipping') {
      setFormData({
        ...formData,
        shipping_address_id: address.id,
        shipping_line_1: address.line_1,
        shipping_line_2: address.line_2,
        shipping_city: address.city,
        shipping_zip_code: address.zip_code,
        shipping_country: address.country
      });
      setShowShippingAddressList(false);
    } else {
      setFormData({
        ...formData,
        billing_address_id: address.id,
        billing_line_1: address.line_1,
        billing_line_2: address.line_2,
        billing_city: address.city,
        billing_zip_code: address.zip_code,
        billing_country: address.country
      });
      setShowBillingAddressList(false);
    }
  };
  
  const validateForm = () => {
    const errors = {};
    if (isGuestCheckout) {
      if (!formData.email) errors.email = 'Email is required';
      if (!formData.first_name) errors.first_name = 'First name is required';
      if (!formData.last_name) errors.last_name = 'Last name is required';
      if (!formData.phone_number) errors.phone_number = 'Phone number is required';
    }
    
    if (!formData.shipping_address_id) {
      if (!formData.shipping_line_1) errors.shipping_line_1 = 'Street address is required';
      if (!formData.shipping_city) errors.shipping_city = 'City is required';
      if (!formData.shipping_zip_code) errors.shipping_zip_code = 'Postal code is required';
      if (!formData.shipping_country) errors.shipping_country = 'Country is required';
    }
    
    if (!formData.same_as_shipping && !formData.billing_address_id) {
      if (!formData.billing_line_1) errors.billing_line_1 = 'Street address is required';
      if (!formData.billing_city) errors.billing_city = 'City is required';
      if (!formData.billing_zip_code) errors.billing_zip_code = 'Postal code is required';
      if (!formData.billing_country) errors.billing_country = 'Country is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const calculateTax = () => {
    return cart.subtotal * 0.1;
  };
  
  const calculateShipping = () => {
    return formData.shipping_method === 'express' ? 20.00 : 10.00;
  };
  
  const calculateTotal = () => {
    return cart.subtotal + calculateTax() + calculateShipping();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const orderData = {
      shipping_address_id: formData.shipping_address_id || null,
      billing_address_id: formData.same_as_shipping 
        ? formData.shipping_address_id 
        : formData.billing_address_id || null,
      
      shipping_line_1: formData.shipping_line_1,
      shipping_line_2: formData.shipping_line_2,
      shipping_city: formData.shipping_city,
      shipping_zip_code: formData.shipping_zip_code,
      shipping_country: formData.shipping_country,
      
      billing_line_1: !formData.same_as_shipping ? formData.billing_line_1 : null,
      billing_line_2: !formData.same_as_shipping ? formData.billing_line_2 : null,
      billing_city: !formData.same_as_shipping ? formData.billing_city : null,
      billing_zip_code: !formData.same_as_shipping ? formData.billing_zip_code : null,
      billing_country: !formData.same_as_shipping ? formData.billing_country : null,
      
      email: formData.email || (user?.email || ''),
      first_name: formData.first_name || (user?.first_name || ''),
      last_name: formData.last_name || (user?.last_name || ''),
      country_code: formData.country_code || '',
      phone_number: formData.phone_number || '',
      
      shipping_method: formData.shipping_method,
      tax: calculateTax(),
      shipping_cost: calculateShipping(),
    };
    const orderResult =  await dispatch(createOrder(orderData));
    const paymentResult = await dispatch(processPayment({
        user_id: user?.id || null,
        currency: 'PHP',
        amount: calculateTotal(),
        status: 'fulfilled',
        transaction_id: 'T123',
        payment_method: formData.payment_method
    }));
    dispatch(payOrder({
        orderId: orderResult?.payload?.order?.id,
        orderData: {
            payment_id: paymentResult?.payload?.payment?.id,
        }
    }));
  };
  
  if (cart?.items?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <FaShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some items to your cart before proceeding to checkout.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              {isGuestCheckout && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${validationErrors.phone_number ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {validationErrors.phone_number && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.phone_number}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${validationErrors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {validationErrors.first_name && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.first_name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${validationErrors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {validationErrors.last_name && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.last_name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Country Code</label>
                      <input
                        type="text"
                        name="country_code"
                        value={formData.country_code}
                        onChange={handleInputChange}
                        placeholder="e.g. US, CA, UK"
                        className="w-full p-2 border rounded border-gray-300"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              {user && (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => setShowShippingAddressList(true)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded transition"
                  >
                    Select from Saved Addresses
                  </button>
                </div>
              )}
              
              {showShippingAddressList && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                    <SelectAddress 
                        title="Select Shipping Address"
                        addresses={addresses}
                        onSelect={(address) => handleAddressSelection('shipping', address)}
                        onClose={() => setShowShippingAddressList(false)}
                        addressType="shipping"
                    />
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="shipping_line_1"
                    value={formData.shipping_line_1}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${validationErrors.shipping_line_1 ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {validationErrors.shipping_line_1 && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.shipping_line_1}</p>
                  )}
                </div>
                
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-1">Apartment, suite, etc. (optional)</label>
                  <input
                    type="text"
                    name="shipping_line_2"
                    value={formData.shipping_line_2}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded border-gray-300"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="shipping_city"
                    value={formData.shipping_city}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${validationErrors.shipping_city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {validationErrors.shipping_city && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.shipping_city}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Postal/ZIP Code</label>
                  <input
                    type="text"
                    name="shipping_zip_code"
                    value={formData.shipping_zip_code}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${validationErrors.shipping_zip_code ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {validationErrors.shipping_zip_code && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.shipping_zip_code}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="shipping_country"
                    value={formData.shipping_country}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${validationErrors.shipping_country ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {validationErrors.shipping_country && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.shipping_country}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="standard"
                    name="shipping_method"
                    value="standard"
                    checked={formData.shipping_method === 'standard'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="standard">Standard Shipping ($10.00) - 5-7 business days</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="express"
                    name="shipping_method"
                    value="express"
                    checked={formData.shipping_method === 'express'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="express">Express Shipping ($20.00) - 2-3 business days</label>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    name="same_as_shipping"
                    checked={formData.same_as_shipping}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  Billing address same as shipping
                </label>
              </div>
              
              {!formData.same_as_shipping && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
                  {user && (
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => setShowBillingAddressList(true)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded transition"
                      >
                        Select from Saved Addresses
                      </button>
                    </div>
                  )}
                  
                  {showBillingAddressList && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <SelectAddress 
                            title="Select Billing Address"
                            addresses={addresses}
                            onSelect={(address) => handleAddressSelection('billing', address)}
                            onClose={() => setShowBillingAddressList(false)}
                            addressType="billing"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="col-span-2">
                      <label className="block text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        name="billing_line_1"
                        value={formData.billing_line_1}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${validationErrors.billing_line_1 ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {validationErrors.billing_line_1 && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.billing_line_1}</p>
                      )}
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-gray-700 mb-1">Apartment, suite, etc. (optional)</label>
                      <input
                        type="text"
                        name="billing_line_2"
                        value={formData.billing_line_2}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded border-gray-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="billing_city"
                        value={formData.billing_city}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${validationErrors.billing_city ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {validationErrors.billing_city && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.billing_city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1">Postal/ZIP Code</label>
                      <input
                        type="text"
                        name="billing_zip_code"
                        value={formData.billing_zip_code}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${validationErrors.billing_zip_code ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {validationErrors.billing_zip_code && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.billing_zip_code}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        name="billing_country"
                        value={formData.billing_country}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded ${validationErrors.billing_country ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {validationErrors.billing_country && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.billing_country}</p>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="credit_card"
                    name="payment_method"
                    value="credit_card"
                    checked={formData.payment_method === 'credit_card'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="credit_card">Credit Card</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="paypal"
                    name="payment_method"
                    value="paypal"
                    checked={formData.payment_method === 'paypal'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="paypal">PayPal</label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </form>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="border-b border-gray-200 pb-4 mb-4">
              {cart?.items?.map((item) => (
                <div key={item.id} className="flex justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium">{item.product?.name || "Product"}</div>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${calculateShipping().toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;