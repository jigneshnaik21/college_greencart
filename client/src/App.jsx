import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Login from "./components/Login";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";
import Loading from "./components/Loading";
import Contact from "./components/Contact";

const App = () => {
  try {
    const isSellerPath = useLocation().pathname.includes("seller");
    const { showUserLogin, isSeller } = useAppContext();

    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Toast notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />

        {/* Navigation */}
        {!isSellerPath && <Navbar />}
        {showUserLogin && <Login />}

        {/* Main Content */}
        <main
          className={`flex-grow ${
            isSellerPath ? "" : "px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32"
          }`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/products/:category" element={<ProductCategory />} />
            <Route
              path="/products/:category/:id"
              element={<ProductDetails />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-address" element={<AddAddress />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/loader" element={<Loading />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/seller"
              element={isSeller ? <SellerLayout /> : <SellerLogin />}
            >
              <Route index element={isSeller ? <AddProduct /> : null} />
              <Route path="product-list" element={<ProductList />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          </Routes>
        </main>

        {/* Footer */}
        {!isSellerPath && (
          <footer className="mt-auto">
            <Footer />
          </footer>
        )}
      </div>
    );
  } catch (error) {
    console.error("App Error:", error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">App Error</h1>
          <p className="text-gray-600 mb-2">
            Something went wrong loading the app.
          </p>
          <p className="text-sm text-gray-500">
            Check the browser console for details.
          </p>
          <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">
            {error.message}
          </pre>
        </div>
      </div>
    );
  }
};

export default App;
