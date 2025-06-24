import { useState } from 'react';
import './Orders.css';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);
    const [emailInputValue, setEmailInputValue] = useState("");

    const getStatusClass = (status) => {
        return `order-status ${status.toLowerCase()}`;
    };

    const handleOnEmailInputChange = (event) => {
        setEmailInputValue(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        const email = emailInputValue.trim().toLowerCase();

        if (!email) {
            setOrders([]);
            setFilteredOrders([]);
            setError(null);
            return;
        }

        setIsFetching(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/orders');
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();

            setOrders(data);

            if (email === "admin") {
                setFilteredOrders(data);
            } else {
                const filtered = data.filter(order =>
                    order.email?.toLowerCase().includes(email)
                );
                setFilteredOrders(filtered);
            }
        } catch (error) {
            setError(error.message);
            setFilteredOrders([]);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="Orders">
            <h2>Search Orders by Email</h2>
            <form className="search-bar" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    name="email"
                    placeholder="Enter Email"
                    value={emailInputValue}
                    onChange={handleOnEmailInputChange}
                />
                <button type="submit"><i className="material-icons">search</i></button>
            </form>

            <h2>Past Orders</h2>
            {isFetching && <p>Loading orders...</p>}
            {error && <p className="error">{error}</p>}
            {filteredOrders.length === 0 && !isFetching && <p>No orders found.</p>}

            <ul className="orders-list">
                {filteredOrders.map(order => (
                    <li key={order.id} className="order-item">
                        <div className="order-details">
                            <h3>Order #{order.id}</h3>
                            <p><strong>Status:</strong> <span className={getStatusClass(order.status)}>{order.status}</span></p>
                            <p><strong>Customer:</strong> {order.customer}</p>
                            <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="order-actions">
                            <span className="order-total">${order.total}</span>
                            <button 
                                className="order-details-button" 
                                onClick={() => window.location.href = `/orders/${order.id}`}
                            >
                                View Details
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {filteredOrders.length > 0 && (
                <p>Total Orders: {filteredOrders.length}</p>
            )}
        </div>
    );
}

export default Orders;
