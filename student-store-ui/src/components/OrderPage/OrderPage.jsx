import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './OrderPage.css';

function OrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsFetching(true);
      try {
        const res = await fetch(`http://localhost:3000/orders/${orderId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusClass = (status) => {
    return `order-status ${status.toLowerCase()}`;
  };

  if (isFetching) return (
    <div className="OrderPage">
      <p>Loading order...</p>
    </div>
  );
  
  if (error) return (
    <div className="OrderPage">
      <p className="error">{error}</p>
    </div>
  );
  
  if (!order) return null;

  return (
    <div className="OrderPage">
      <h1>Order #{order.id}</h1>
      
      <div className="order-summary">
        <p><strong>Customer:</strong> {order.customer}</p>
        <p>
          <strong>Status:</strong> 
          <span className={getStatusClass(order.status)}>{order.status}</span>
        </p>
        <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p className="order-total"><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      </div>

      <h2>Order Items</h2>
      <ul className="order-items">
        {order.orderItems.map(item => (
          <li key={item.id} className="order-item-details">
            <p><strong>Product ID:</strong> <span>{item.productId}</span></p>
            <p><strong>Quantity:</strong> <span>{item.quantity}</span></p>
            <p><strong>Price:</strong> <span>${item.price.toFixed(2)}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderPage;