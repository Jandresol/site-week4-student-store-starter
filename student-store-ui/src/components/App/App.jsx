import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import SubNavbar from "../SubNavbar/SubNavbar";
import Sidebar from "../Sidebar/Sidebar";
import Home from "../Home/Home";
import ProductDetail from "../ProductDetail/ProductDetail";
import NotFound from "../NotFound/NotFound";
import { removeFromCart, addToCart, getQuantityOfItemInCart, getTotalItemsInCart } from "../../utils/cart";
import "./App.css";
import Header from "../Header/Header"
import Orders from "../Orders/Orders";
import OrderPage from "../OrderPage/OrderPage";

function App() {

  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", email: ""});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  // Toggles sidebar
  const toggleSidebar = () => setSidebarOpen((isOpen) => !isOpen);

  // Functions to change state (used for lifting state)
  const handleOnRemoveFromCart = (item) => setCart(removeFromCart(cart, item));
  const handleOnAddToCart = (item) => setCart(addToCart(cart, item));
  const handleGetItemQuantity = (item) => getQuantityOfItemInCart(cart, item);
  const handleGetTotalCartItems = () => getTotalItemsInCart(cart);

  const handleOnSearchInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  // Populate Database on submit
  const handleOnCheckout = async () => {
    // Create an order
    const orderRes = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: userInfo.name,
        email: userInfo.email,
        status: "completed"
      }),
    });

    const order = await orderRes.json();

    // Initialize items array
    const cartItems = Object.entries(cart).map(([productId, quantity]) => ({
      productId: Number(productId),
      quantity,
    }));

    // Post request for all order items
    for (const item of cartItems) {
      await fetch(`http://localhost:3000/orders/${order.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    }

    console.log("Order complete:", order);
    setCart({});
    setOrder(order);
  };


  useEffect(() => {
    const fetchProducts = async () => {
      setIsFetching(true);
      try {
        const { data } = await axios.get("http://localhost:3000/products") ;
        console.log(data);
        setProducts(data);
        } catch (err) {
          console.error("Error Fetching Products")
        } finally {
          setIsFetching(false);
        }
      };
      fetchProducts();
    }, []);


  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar
          cart={cart}
          error={error}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isOpen={sidebarOpen}
          products={products}
          toggleSidebar={toggleSidebar}
          isCheckingOut={isCheckingOut}
          addToCart={handleOnAddToCart}
          removeFromCart={handleOnRemoveFromCart}
          getQuantityOfItemInCart={handleGetItemQuantity}
          getTotalItemsInCart={handleGetTotalCartItems}
          handleOnCheckout={handleOnCheckout}
          order={order}
          setOrder={setOrder}
        />
        <main>
          <Header/>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SubNavbar
                    toggleSidebar={toggleSidebar}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    searchInputValue={searchInputValue}
                    handleOnSearchInputChange={handleOnSearchInputChange}
                  />
                  <Home
                    error={error}
                    products={products}
                    isFetching={isFetching}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    addToCart={handleOnAddToCart}
                    searchInputValue={searchInputValue}
                    removeFromCart={handleOnRemoveFromCart}
                    getQuantityOfItemInCart={handleGetItemQuantity}
                  />
                </>
              }
            />
            <Route
              path="/:productId"
              element={
                <ProductDetail
                  cart={cart}
                  error={error}
                  products={products}
                  addToCart={handleOnAddToCart}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="/orders"
              element={
                <Orders/>
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <OrderPage/>
              }
            />
            <Route
              path="*"
              element={
                <NotFound
                  error={error}
                  products={products}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;