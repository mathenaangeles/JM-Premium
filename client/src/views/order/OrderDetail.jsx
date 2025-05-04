import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, cancelOrder, updateOrder, getGuestOrder } from '../../slices/orderSlice';

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { order, loading, error, success } = useSelector((state) => state.order);
    const { user } = useSelector((state) => state.user);
    const [editStatus, setEditStatus] = useState(order?.status || '');
    const [trackingNumber, setTrackingNumber] = useState(order?.tracking_number || '');
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        if (orderId) {
            if (user) {
                dispatch(getOrder(orderId));
            } else {
                const email = localStorage.getItem('guestEmail');
                if (email) {
                    dispatch(getGuestOrder({ orderId, email }));
                } 
            }
        }
    }, [dispatch, orderId, navigate, user]);

    useEffect(() => {
        if (success) {
        setShowConfirmation(false);
        }
    }, [success]);

    const handleCancelOrder = () => {
        dispatch(cancelOrder(orderId));
    };

    const handleUpdateOrder = () => {
        dispatch(updateOrder({
          orderId: order.id,
          orderData: {
            status: editStatus,
            tracking_number: trackingNumber || undefined,
          }
        }));
      };

    const getStatusIcon = (status) => {
        switch (status) {
        case 'pending':
            return <div className="text-yellow-500" size={24} />;
        case 'processing':
            return <div className="text-blue-500" size={24} />;
        case 'shipped':
            return <div className="text-purple-500" size={24} />;
        case 'delivered':
            return <div className="text-green-500" size={24} />;
        case 'cancelled':
            return <div className="text-red-500" size={24} />;
        default:
            return <div className="text-gray-500" size={24} />;
        }
    };

    if (loading) {
        return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
        </div>
        );
    }

    if (!order) {
        return <div className="text-center text-gray-600">Order not found</div>;
    }

    const canCancelOrder = user && order.status === 'pending';
    const canEditOrder = user && user.is_admin === true;;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Order #{order.id}</h2>
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
            {getStatusIcon(order.status)}
            <span className="capitalize font-medium">{order.status}</span>
            </div>
        </div>

        {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {success}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Order Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
                <p><span className="font-medium">Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                <p><span className="font-medium">Shipping Method:</span> {order.shipping_method}</p>
                <p><span className="font-medium">Total:</span> ${order.total.toFixed(2)}</p>
            </div>
            </div>
            <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Shipping Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
                <p><span className="font-medium">Name:</span> {order.user?.first_name} {order.user?.last_name}</p>
                <p><span className="font-medium">Address:</span> {order.shipping_address?.line_1}</p>
                <p><span className="font-medium">City:</span> {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zip}</p>
            </div>
            </div>
        </div>

        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Order Items</h3>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {order.items?.map((item) => (
                    <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                        {item.image && (
                            <img className="h-10 w-10 rounded-full mr-3" src={item.product.image} alt={item.name} />
                        )}
                        <div>
                            <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr className="bg-gray-50">
                    <td colSpan="3" className="px-6 py-4 text-right font-medium">Subtotal:</td>
                    <td className="px-6 py-4">${order.subtotal?.toFixed(2)}</td>
                </tr>
                <tr className="bg-gray-50">
                    <td colSpan="3" className="px-6 py-4 text-right font-medium">Shipping:</td>
                    <td className="px-6 py-4">${order.shipping_cost?.toFixed(2)}</td>
                </tr>
                <tr className="bg-gray-50">
                    <td colSpan="3" className="px-6 py-4 text-right font-medium">Tax:</td>
                    <td className="px-6 py-4">${order.tax?.toFixed(2)}</td>
                </tr>
                <tr className="bg-gray-50">
                    <td colSpan="3" className="px-6 py-4 text-right font-bold">Total:</td>
                    <td className="px-6 py-4 font-bold">${order.total?.toFixed(2)}</td>
                </tr>
                </tfoot>
            </table>
            </div>
        </div>

        <div className="flex justify-between mt-8">
            <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
            Back
            </button>

            {canCancelOrder && (
            <>
                {showConfirmation ? (
                <div className="flex items-center space-x-4">
                    <span className="text-red-500">Are you sure?</span>
                    <button 
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    >
                    No
                    </button>
                    <button 
                    onClick={handleCancelOrder}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                    Yes, Cancel
                    </button>
                </div>
                ) : (
                <button 
                    onClick={() => setShowConfirmation(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    Cancel Order
                </button>
                )}
            </>
            )} 
        </div>
        {canEditOrder && (
            <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Admin: Update Order</h3>

                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                </select>
                </div>

                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1Z1234567890"
                />
                </div>

                <button
                onClick={handleUpdateOrder}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                Update Order
                </button>
            </div>
            )}
        </div>
    );
};

export default OrderDetails;