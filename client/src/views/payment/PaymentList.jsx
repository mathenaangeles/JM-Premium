import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';

import { getPayments } from '../../slices/paymentSlice';

const PaymentList = () => {
  const dispatch = useDispatch();
  
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [userId, _] = useState(null);
  const [status, setStatus] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const { payments, loading, error, count, totalPages } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(getPayments({ page, perPage, userId, status, paymentMethod }));
  }, [dispatch, page, userId, status, paymentMethod, perPage]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value === 'all' ? null : e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value === 'all' ? null : e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <FaSpinner size={48} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Payments List</h2>
      
      <div className="flex mb-4 space-x-4">
        <select 
          value={status || 'all'}
          onChange={handleStatusChange} 
          className="border px-4 py-2"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="failed">Failed</option>
        </select>
        
        <select 
          value={paymentMethod || 'all'}
          onChange={handlePaymentMethodChange} 
          className="border px-4 py-2"
        >
          <option value="all">All Payment Methods</option>
          <option value="credit_card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Payment ID</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Payment Method</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments && payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-4 py-2 text-blue-600 hover:underline">
                    <Link to={`/manage/payments/${payment.id}`}>{payment.id}</Link>
                </td>
                <td className="px-4 py-2">{payment.user ? payment.user.email : 'Guest'}</td>
                <td className="px-4 py-2">{payment.amount}</td>
                <td className="px-4 py-2">{payment.status}</td>
                <td className="px-4 py-2">{payment.payment_method}</td>
                <td className="px-4 py-2">{new Date(payment.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === Math.ceil(count / perPage)}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaymentList;
