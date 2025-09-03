import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const {
    user,
    setUser,
    setShowUserLogin,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  // Safety check for getCartCount
  const cartCount = typeof getCartCount === "function" ? getCartCount() : 0;

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        // Clear header-token auth
        if (axios.defaults.headers.common["Authorization"]) {
          delete axios.defaults.headers.common["Authorization"];
        }
        localStorage.removeItem("authToken");
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <>
      <nav className="flex items-center justify-between px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all fixed top-0 w-full z-50">
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className="flex-shrink-0"
        >
          <img className="h-8 sm:h-9" src={assets.logo} alt="logo" />
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-8">
          <NavLink to="/" className="hover:text-primary transition-colors">
            Home
          </NavLink>
          <NavLink
            to="/products"
            className="hover:text-primary transition-colors"
          >
            All Product
          </NavLink>
          <NavLink to="/" className="hover:text-primary transition-colors">
            Contact
          </NavLink>

          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4" />
          </div>

          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer p-2"
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 opacity-80"
            />
            <button className="absolute -top-1 -right-1 text-xs text-white bg-primary w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </button>
          </div>

          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="cursor-pointer px-8 py-2.5 bg-primary hover:bg-primary-dull transition text-white rounded-full"
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <img
                src={assets.profile_icon}
                className="w-10 cursor-pointer"
                alt="profile"
              />
              <ul className="hidden group-hover:block absolute top-12 right-0 bg-white shadow-lg border border-gray-100 py-2 w-36 rounded-lg text-sm z-40">
                <li
                  onClick={() => navigate("my-orders")}
                  className="px-4 py-2 hover:bg-primary/10 cursor-pointer"
                >
                  My Orders
                </li>
                <li
                  onClick={logout}
                  className="px-4 py-2 hover:bg-primary/10 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Navigation Top */}
        <div className="flex items-center gap-4 sm:hidden">
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer p-2"
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 opacity-80"
            />
            <button className="absolute -top-1 -right-1 text-xs text-white bg-primary w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </button>
          </div>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="p-2"
          >
            <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg py-4 flex flex-col items-start gap-2 px-6 text-base sm:hidden animate-slideDown">
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className="w-full py-3 hover:bg-gray-50"
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setOpen(false)}
              className="w-full py-3 hover:bg-gray-50"
            >
              All Products
            </NavLink>
            {user && (
              <NavLink
                to="/my-orders"
                onClick={() => setOpen(false)}
                className="w-full py-3 hover:bg-gray-50"
              >
                My Orders
              </NavLink>
            )}
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className="w-full py-3 hover:bg-gray-50"
            >
              Contact
            </NavLink>

            <div className="flex items-center w-full gap-2 border border-gray-300 px-3 rounded-lg mt-2">
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-3 w-full bg-transparent outline-none placeholder-gray-500"
                type="text"
                placeholder="Search products"
              />
              <img src={assets.search_icon} alt="search" className="w-5 h-5" />
            </div>

            {!user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowUserLogin(true);
                }}
                className="w-full py-3 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-lg text-center"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="w-full py-3 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-lg text-center"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-2 sm:hidden z-50">
        <NavLink to="/" className="flex flex-col items-center p-2">
          <img src={assets.home_icon} alt="home" className="w-6 h-6 mb-1" />
          <span className="text-xs">Home</span>
        </NavLink>
        <NavLink to="/products" className="flex flex-col items-center p-2">
          <img
            src={assets.product_list_icon}
            alt="products"
            className="w-6 h-6 mb-1"
          />
          <span className="text-xs">Products</span>
        </NavLink>
        <NavLink to="/cart" className="flex flex-col items-center p-2">
          <div className="relative">
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 h-6 mb-1"
            />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </div>
          <span className="text-xs">Cart</span>
        </NavLink>
        {user ? (
          <NavLink to="/my-orders" className="flex flex-col items-center p-2">
            <img
              src={assets.profile_icon}
              alt="profile"
              className="w-6 h-6 mb-1"
            />
            <span className="text-xs">Profile</span>
          </NavLink>
        ) : (
          <button
            onClick={() => setShowUserLogin(true)}
            className="flex flex-col items-center p-2"
          >
            <img
              src={assets.profile_icon}
              alt="login"
              className="w-6 h-6 mb-1"
            />
            <span className="text-xs">Login</span>
          </button>
        )}
      </div>

      {/* Add padding to main content to account for fixed navbar */}
      <div className="h-[60px] sm:h-[72px]" />
      {/* Add padding to main content to account for bottom navigation on mobile */}
      <div className="h-[64px] sm:h-0" />
    </>
  );
};

export default Navbar;
