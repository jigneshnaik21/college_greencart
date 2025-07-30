import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

// Configure axios defaults
axios.defaults.withCredentials = true;

// Get the backend URL from environment variables or construct it dynamically
const getBackendUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Get the current hostname (IP address or domain)
  const hostname = window.location.hostname;

  // If accessing from localhost, use localhost
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:4000";
  }

  // For production, construct the backend URL based on the current domain
  // This assumes your backend is deployed on the same Vercel account
  const domain = window.location.hostname;

  // If frontend and backend are on same domain, use relative URLs
  if (domain.includes("vercel.app")) {
    return ""; // Use relative URLs for same-domain deployment
  }

  // For separate domains, you would specify the backend URL
  return "";
};

const backendUrl = getBackendUrl();
axios.defaults.baseURL = backendUrl;

// Add request interceptor for error handling
axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error("Response error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config.url,
        method: error.config.method,
      });

      // Show error toast with server message if available
      const errorMessage = error.response.data?.error?.message || error.message;
      toast.error(errorMessage);
    } else if (error.request) {
      // Request was made but no response
      console.error("No response received:", {
        request: error.request,
        url: error.config.url,
        method: error.config.method,
      });
      toast.error("Server not responding. Please try again later.");
    } else {
      // Something else happened
      console.error("Error:", error.message);
      toast.error("An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartLoading, setCartLoading] = useState(false);

  // Check user authentication status
  const checkUser = async () => {
    try {
      const response = await axios.get("/api/user/is-auth");
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };

  // Check seller status
  const checkSeller = async () => {
    try {
      const response = await axios.get("/api/seller/is-auth");
      setIsSeller(response.data.isSeller);
    } catch (error) {
      console.error("Error fetching seller status:", error);
      setIsSeller(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/product/list");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Get cart count function
  const getCartCount = () => {
    if (!user || !user.cartItems) return 0;
    return Object.values(user.cartItems).reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  // Get cart items
  const getCartItems = () => {
    if (!user || !user.cartItems) {
      return {};
    }
    return user.cartItems;
  };

  // Get cart amount
  const getCartAmount = () => {
    if (!user?.cartItems || !products.length) return 0;
    return Object.entries(user.cartItems).reduce((total, [productId, item]) => {
      const product = products.find((p) => p._id === productId);
      return total + (product?.offerPrice || 0) * (item.quantity || 0);
    }, 0);
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      if (!user) {
        setShowUserLogin(true);
        return;
      }

      if (cartLoading) return;

      setCartLoading(true);

      // Optimistically update the cart
      const currentCartItems = user.cartItems || {};
      const updatedCartItems = {
        ...currentCartItems,
        [productId]: { quantity },
      };

      // Temporarily update user state optimistically
      setUser((prevUser) => ({
        ...prevUser,
        cartItems: updatedCartItems,
      }));

      const response = await axios.post("/api/cart/update", {
        userId: user._id,
        cartItems: updatedCartItems,
      });

      if (response.data.success) {
        // Update with the actual server response
        setUser(response.data.user);
      } else {
        // Revert optimistic update if request failed
        setUser((prevUser) => ({
          ...prevUser,
          cartItems: currentCartItems,
        }));
      }
    } catch (error) {
      console.error("Error updating cart item:", error);

      // Revert optimistic update on error
      const currentCartItems = user.cartItems || {};
      setUser((prevUser) => ({
        ...prevUser,
        cartItems: currentCartItems,
      }));
    } finally {
      setCartLoading(false);
    }
  };

  // Add to cart function
  const addToCart = async (productId) => {
    try {
      // Check if user is authenticated
      if (!user) {
        setShowUserLogin(true);
        return;
      }

      // Prevent duplicate requests
      if (cartLoading) {
        console.log("Cart is loading, skipping request");
        return; // If already loading, don't make another request
      }

      console.log("Adding to cart:", productId);
      setCartLoading(true);

      // Optimistically update the cart to prevent race conditions
      const currentCartItems = user.cartItems || {};
      const updatedCartItems = {
        ...currentCartItems,
        [productId]: {
          quantity: (currentCartItems[productId]?.quantity || 0) + 1,
        },
      };

      // Temporarily update user state optimistically
      setUser((prevUser) => ({
        ...prevUser,
        cartItems: updatedCartItems,
      }));

      const response = await axios.post("/api/cart/add", { productId });
      console.log("Add to cart response:", response.data);

      if (response.data.success) {
        // Update with the actual server response
        setUser(response.data.user);
        console.log(
          "Updated user with new cart:",
          response.data.user.cartItems
        );
      } else {
        // Revert optimistic update if request failed
        setUser((prevUser) => ({
          ...prevUser,
          cartItems: currentCartItems,
        }));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);

      // Revert optimistic update on error
      const currentCartItems = user.cartItems || {};
      setUser((prevUser) => ({
        ...prevUser,
        cartItems: currentCartItems,
      }));

      // If unauthorized, show login modal
      if (
        error.response?.status === 401 ||
        error.response?.data?.message === "Not Authorized"
      ) {
        setShowUserLogin(true);
      }
    } finally {
      setCartLoading(false);
    }
  };

  // Remove from cart function
  const removeFromCart = async (productId) => {
    try {
      // Check if user is authenticated
      if (!user) {
        setShowUserLogin(true);
        return;
      }

      if (cartLoading) {
        return; // Prevent duplicate requests
      }

      setCartLoading(true);

      // Optimistically update the cart
      const currentCartItems = user.cartItems || {};
      const updatedCartItems = { ...currentCartItems };
      delete updatedCartItems[productId];

      // Temporarily update user state optimistically
      setUser((prevUser) => ({
        ...prevUser,
        cartItems: updatedCartItems,
      }));

      const response = await axios.post("/api/cart/remove", { productId });
      if (response.data.success) {
        // Update with the actual server response
        setUser(response.data.user);
      } else {
        // Revert optimistic update if request failed
        setUser((prevUser) => ({
          ...prevUser,
          cartItems: currentCartItems,
        }));
      }
    } catch (error) {
      console.error("Error removing from cart:", error);

      // Revert optimistic update on error
      const currentCartItems = user.cartItems || {};
      setUser((prevUser) => ({
        ...prevUser,
        cartItems: currentCartItems,
      }));

      // If unauthorized, show login modal
      if (
        error.response?.status === 401 ||
        error.response?.data?.message === "Not Authorized"
      ) {
        setShowUserLogin(true);
      }
    } finally {
      setCartLoading(false);
    }
  };

  // Currency symbol
  const currency = "₹";

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        await Promise.all([checkUser(), checkSeller(), fetchProducts()]);
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    // Refresh data periodically
    const refreshInterval = setInterval(initializeApp, 300000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isSeller,
        setIsSeller,
        products,
        setProducts,
        loading,
        showUserLogin,
        setShowUserLogin,
        searchQuery,
        setSearchQuery,
        checkUser,
        checkSeller,
        fetchProducts,
        getCartCount,
        getCartItems,
        getCartAmount,
        updateCartItem,
        addToCart,
        removeFromCart,
        cartLoading,
        currency,
        navigate,
        axios,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
