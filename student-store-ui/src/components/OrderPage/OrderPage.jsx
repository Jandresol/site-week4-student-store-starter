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
        <h2>Order Details</h2>
        <p>
        <strong>Customer:</strong>{" "}
        <span>{order.customer}</span>
        </p>

        <p>
        <strong>Status:</strong>{" "}
        <span className={getStatusClass(order.status)}>{order.status}</span>
        </p>
        <p>
        <strong>Created At:</strong>{" "}
        {new Date(order.createdAt).toLocaleDateString()}
        </p>
    </div>

  <div className="order-items-table">
    <h2>Order Items</h2>
    <div className="order-item-header">
      <span>Image</span>
      <span>Product</span>
      <span>Quantity</span>
      <span>Price</span>
    </div>

    {order.orderItems.map((item) => (
      <div key={item.id} className="order-item-row">
        <div className="order-item-image">
          {item.product?.image_url && (
            <img
              src={item.product.image_url}
              alt={item.product.name}
              className="order-img"
            />
          )}
        </div>
        <div>{item.product?.name || "Product not found"}</div>
        <div>{item.quantity}</div>
        <div>${(item.price * item.quantity).toFixed(2)}</div>
      </div>
      
    ))}
            <p className="order-total">
        <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>

  </div>

</div>
    );
}

export default OrderPage;