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

// Mobile browser detection and configuration
const isMobile = () => {
  const userAgent = navigator.userAgent;
  const screenWidth = window.innerWidth;

  const mobileCheck =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
      userAgent
    ) || screenWidth <= 768;

  console.log("🔍 MOBILE DEBUG: isMobile() called - Result:", mobileCheck);
  console.log("🔍 MOBILE DEBUG: User Agent:", userAgent);
  console.log("🔍 MOBILE DEBUG: Screen Width:", screenWidth);

  return mobileCheck;
};

// Configure axios defaults
axios.defaults.withCredentials = false;

// Enhanced cookie handling for mobile
if (isMobile()) {
  console.log("🔍 MOBILE DEBUG: Configuring enhanced cookie handling");
  // Ensure cookies are sent with requests
  axios.defaults.withCredentials = true;
  // Add mobile-specific headers for better cookie handling
  axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
}

// Emergency mobile toast override - runs before any other code
if (
  /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  console.log("Mobile device detected, setting up emergency toast override");

  // Override toast.error globally for mobile
  const originalToastError = toast.error;
  toast.error = (message) => {
    // Allow login-related errors to show on mobile
    if (
      typeof message === "string" &&
      (message.includes("Login") ||
        message.includes("Invalid email") ||
        message.includes("Invalid password") ||
        message.includes("Backend connection") ||
        message.includes("Login timeout") ||
        message.includes("Server error"))
    ) {
      console.log("Mobile login error allowed:", message);
      return originalToastError(message);
    }

    if (
      typeof message === "string" &&
      (message.includes("Network") ||
        message.includes("connection") ||
        message.includes("check your") ||
        message.includes("timeout") ||
        message.includes("Server not responding"))
    ) {
      console.log("Mobile toast blocked:", message);
      return; // Don't show any network-related errors on mobile
    }
    return originalToastError(message);
  };
}

// Configure axios for mobile browsers
if (isMobile()) {
  console.log("Mobile browser detected, configuring for mobile compatibility");
  // Add mobile-specific headers
  axios.defaults.headers.common["Cache-Control"] = "no-cache";
  axios.defaults.headers.common["Pragma"] = "no-cache";

  // Increase timeout for mobile networks
  axios.defaults.timeout = 60000; // 60 seconds for mobile

  // Add retry logic for mobile
  axios.defaults.retry = 1; // Single retry to avoid spam
  axios.defaults.retryDelay = 3000; // Increased delay between retries
}

// Get the backend URL from environment variables or construct it dynamically
const getBackendUrl = () => {
  // Check for environment variable first - this should be the primary source
  if (import.meta.env.VITE_API_URL) {
    console.log("Using VITE_API_URL:", import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }

  // Get the current hostname (IP address or domain)
  const hostname = window.location.hostname;
  console.log("Current hostname:", hostname);

  // If accessing from localhost, use localhost
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    console.log("Using localhost backend");
    return "http://localhost:4000";
  }

  // For production, use the deployed backend URL
  const productionBackendUrl =
    "https://server-nkzr97txs-jignesh-naiks-projects.vercel.app";
  console.log("Using production backend URL:", productionBackendUrl);
  return productionBackendUrl;
};

// Initialize backend URL and configure axios
const initializeBackendUrl = () => {
  const backendUrl = getBackendUrl();
  console.log("🔍 MOBILE DEBUG: Initializing backend URL:", backendUrl);

  // Set the base URL for axios
  axios.defaults.baseURL = backendUrl;

  // Log the final configuration
  console.log("🔍 MOBILE DEBUG: Final axios baseURL:", axios.defaults.baseURL);
  console.log(
    "🔍 MOBILE DEBUG: Final axios withCredentials:",
    axios.defaults.withCredentials
  );

  return backendUrl;
};

// Initialize backend URL properly
initializeBackendUrl();

// Function to switch backend URL on mobile
const switchBackendUrl = (failedUrl) => {
  if (!isMobile()) return;

  const backendUrls = [
    "https://greencartbackend-jignesh-naiks-projects.vercel.app",
  ];

  const currentIndex = backendUrls.indexOf(failedUrl);
  const nextUrl = backendUrls[(currentIndex + 1) % backendUrls.length];

  console.log(`Switching mobile backend URL from ${failedUrl} to ${nextUrl}`);
  sessionStorage.setItem("mobile_backend_url", nextUrl);
  axios.defaults.baseURL = nextUrl;
};

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

// Add response interceptor for error handling with retry logic
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;

    // Retry logic for mobile devices
    if (isMobile() && config && !config.__isRetryRequest) {
      config.__isRetryRequest = true;

      if (config.retry && config.retry > 0) {
        config.retry -= 1;

        console.log(
          `Retrying request to ${config.url}, attempts left: ${config.retry}`
        );

        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, config.retryDelay || 1000)
        );

        return axios(config);
      }
    }

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

      // For mobile, try switching backend URL on network failure
      if (isMobile() && error.config && error.config.baseURL) {
        switchBackendUrl(error.config.baseURL);
      }

      // Only show network error toast if we haven't shown one recently
      if (!error.config.__errorShown) {
        error.config.__errorShown = true;

        if (isMobile()) {
          toast.error("Network issue. Please check your connection.");
        } else {
          toast.error("Server not responding. Please try again later.");
        }

        // Reset error shown flag after 10 seconds
        setTimeout(() => {
          if (error.config) {
            error.config.__errorShown = false;
          }
        }, 10000);
      }
    } else {
      // Something else happened
      console.error("Error:", error.message);
      if (!error.config?.__errorShown) {
        error.config.__errorShown = true;
        toast.error("An unexpected error occurred.");
      }
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
  const [mobileNetworkStatus, setMobileNetworkStatus] = useState("checking");
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Token management
  const getToken = () => localStorage.getItem("authToken");
  const setToken = (token) => {
    if (token) {
      localStorage.setItem("authToken", token);
      // Set Authorization header for all future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Initialize token on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Set mobile network status on initialization
  useEffect(() => {
    if (isMobile()) {
      console.log(
        "🔍 MOBILE DEBUG: Device detected, setting up for mobile usage"
      );
      setMobileNetworkStatus("connected");

      // Test mobile connectivity
      const testMobileConnectivity = async () => {
        console.log("🔍 MOBILE DEBUG: Testing mobile connectivity...");

        try {
          // Test basic internet connectivity
          await fetch("https://httpbin.org/get", {
            method: "GET",
            mode: "no-cors",
          });
          console.log("✅ MOBILE DEBUG: Basic internet connectivity: OK");

          // Test backend connectivity
          const backendTest = await axios.get(
            `${axios.defaults.baseURL}/api/health`,
            {
              timeout: 10000,
            }
          );
          console.log(
            "✅ MOBILE DEBUG: Backend connectivity:",
            backendTest.data
          );
        } catch (error) {
          console.error("❌ MOBILE DEBUG: Connectivity test failed:", error);
        }
      };

      // Run connectivity test
      testMobileConnectivity();

      // Nuclear option: Physically remove network error messages from DOM
      const removeNetworkErrors = () => {
        const errorMessages = document.querySelectorAll("*");
        errorMessages.forEach((element) => {
          const text = element.textContent || element.innerText || "";
          if (
            text.includes("Network issue") ||
            text.includes("Network issues detected") ||
            text.includes("Please check your connection") ||
            text.includes("Network timeout") ||
            text.includes("Server not responding")
          ) {
            // Find the toast container and remove it
            let toastContainer = element;
            while (
              toastContainer &&
              !toastContainer.classList.contains("toast") &&
              toastContainer.parentElement
            ) {
              toastContainer = toastContainer.parentElement;
            }

            if (toastContainer) {
              toastContainer.style.display = "none";
              toastContainer.remove();
            } else {
              element.style.display = "none";
              element.remove();
            }

            console.log(
              "🔇 MOBILE DEBUG: Removed network error element:",
              text
            );
          }
        });
      };

      // Remove errors every 500ms
      const errorRemovalInterval = setInterval(removeNetworkErrors, 500);

      // Remove errors on DOM changes
      const observer = new MutationObserver(removeNetworkErrors);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Cleanup on unmount
      return () => {
        clearInterval(errorRemovalInterval);
        observer.disconnect();
      };
    }
  }, []);

  // Check user authentication status
  const checkUser = async () => {
    try {
      console.log("🔍 MOBILE DEBUG: Starting checkUser API call");
      console.log(
        "🔍 MOBILE DEBUG: Current axios baseURL:",
        axios.defaults.baseURL
      );
      console.log(
        "🔍 MOBILE DEBUG: Full API URL:",
        `${axios.defaults.baseURL}/api/user/is-auth`
      );

      const token = getToken();
      if (!token) {
        console.log("⚠️ MOBILE DEBUG: No token found");
        setUser(null);
        return;
      }

      const response = await axios.get("/api/user/is-auth");
      console.log("✅ MOBILE DEBUG: checkUser response:", response.data);

      if (response.data.success) {
        setUser(response.data.user);
        console.log("✅ MOBILE DEBUG: User authenticated successfully");
      } else {
        console.log("⚠️ MOBILE DEBUG: User not authenticated");
        setUser(null);
        setToken(null); // Clear invalid token
      }
    } catch (error) {
      console.error("❌ MOBILE DEBUG: Error fetching user:", error);
      console.error("❌ MOBILE DEBUG: Error details:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });

      // On mobile, fail silently for network errors
      if (
        isMobile() &&
        (error.code === "ECONNABORTED" || error.message.includes("Network"))
      ) {
        console.log("🔇 MOBILE DEBUG: Network error suppressed for checkUser");
        return; // Don't set user to null on mobile network errors
      }
      setUser(null);
      setToken(null); // Clear token on error
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
      console.log("🔍 MOBILE DEBUG: Starting fetchProducts API call");
      console.log(
        "🔍 MOBILE DEBUG: Current axios baseURL:",
        axios.defaults.baseURL
      );
      console.log(
        "🔍 MOBILE DEBUG: Full API URL:",
        `${axios.defaults.baseURL}/api/product/list`
      );

      const response = await axios.get("/api/product/list");
      console.log("✅ MOBILE DEBUG: fetchProducts response:", {
        success: response.data.success,
        productCount: response.data.data?.length || 0,
        firstProduct: response.data.data?.[0]?.name || "No products",
      });

      setProducts(response.data.data);
      console.log("✅ MOBILE DEBUG: Products loaded successfully");
    } catch (error) {
      console.error("❌ MOBILE DEBUG: Error fetching products:", error);
      console.error("❌ MOBILE DEBUG: Error details:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });

      // On mobile, fail silently for network errors
      if (
        isMobile() &&
        (error.code === "ECONNABORTED" || error.message.includes("Network"))
      ) {
        console.log(
          "🔇 MOBILE DEBUG: Network error suppressed for fetchProducts"
        );
        // Keep existing products if available, don't clear them
        if (products.length > 0) {
          console.log(
            "✅ MOBILE DEBUG: Keeping existing products on mobile network error"
          );
        } else {
          console.log("⚠️ MOBILE DEBUG: No existing products to keep");
        }
      } else {
        console.log("❌ MOBILE DEBUG: Setting products to empty array");
        setProducts([]);
      }
    } finally {
      setLoading(false);
      console.log(
        "🔍 MOBILE DEBUG: fetchProducts completed, loading set to false"
      );
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
      console.log("addToCart called with productId:", productId);
      console.log("Current user state:", user);
      console.log("Cart loading state:", cartLoading);

      // Check if user is authenticated
      if (!user) {
        console.log("User not authenticated, showing login modal");
        setShowUserLogin(true);
        toast.error("Please login to add items to cart");
        return;
      }

      // Mobile devices will proceed without connectivity checks

      // Prevent duplicate requests
      if (cartLoading) {
        console.log("Cart is loading, skipping request");
        return; // If already loading, don't make another request
      }

      console.log("User is authenticated, proceeding with cart addition");
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
        console.log(
          "🔄 Cart update completed, user state should now be:",
          response.data.user
        );

        // Force a re-render by updating a simple state
        setCartLoading(false);

        // Additional force update
        setTimeout(() => {
          console.log("🔄 Delayed check - Current user state:", user);
          console.log(
            "🔄 Delayed check - Current cart items:",
            user?.cartItems
          );
        }, 500);

        toast.success("Item added to cart successfully!");
      } else {
        // Revert optimistic update if request failed
        setUser((prevUser) => ({
          ...prevUser,
          cartItems: currentCartItems,
        }));
        toast.error(response.data.message || "Failed to add item to cart");
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
        console.log("Unauthorized access, showing login modal");
        setShowUserLogin(true);
        toast.error("Please login to add items to cart");
      } else if (
        error.code === "ECONNABORTED" ||
        error.message.includes("timeout")
      ) {
        // Handle timeout errors
        if (isMobile()) {
          toast.error("Network timeout. Please try again.");
        } else {
          toast.error("Request timeout. Please try again.");
        }
      } else {
        // Show general error
        toast.error("Failed to add item to cart. Please try again.");
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
        mobileNetworkStatus,
        isOfflineMode,
        setIsOfflineMode,
        currency,
        navigate,
        axios,
        setToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
