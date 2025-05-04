import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useParams } from 'react-router-dom'; 

import { getPayment } from '../../slices/paymentSlice';

const PaymentDetail = () => {
  const { paymentId } = useParams(); 
  const dispatch = useDispatch();
  
  const { payment, loading, error } = useSelector((state) => state.payment);

  useEffect(() => {
    if (paymentId) {
      dispatch(getPayment(paymentId)); 
    }
  }, [dispatch, paymentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <FaSpinner size={48} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 py-8">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="py-8">
        <p>No payment found.</p>
      </div>
    );
  }

  return (
    <div className="payment-detail container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Details</h1>
      
      <div className="mb-4">
        <strong>Payment ID:</strong> {payment.id}
      </div>

      <div className="mb-4">
        <strong>User ID:</strong> {payment.user_id || 'N/A'}
      </div>

      <div className="mb-4">
        <strong>Status:</strong> {payment.status}
      </div>

      <div className="mb-4">
        <strong>Payment Method:</strong> {payment.payment_method}
      </div>

      <div className="mb-4">
        <strong>Total Amount:</strong> {payment.amount}
      </div>

      <div className="mb-4">
        <strong>Created At:</strong> {new Date(payment.created_at).toLocaleString()}
      </div>

      <div className="mb-4">
        <strong>Updated At:</strong> {new Date(payment.updated_at).toLocaleString()}
      </div>
    </div>
  );
};

export default PaymentDetail;
