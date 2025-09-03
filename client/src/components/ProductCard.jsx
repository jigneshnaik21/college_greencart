import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const {
    currency,
    addToCart,
    removeFromCart,
    getCartItems,
    navigate,
    user,
    setShowUserLogin,
  } = useAppContext();

  const cartItems = getCartItems() || {};
  const [isMobile, setIsMobile] = React.useState(false);

  // Debug cart state
  React.useEffect(() => {
    console.log("🛒 ProductCard Debug - Product:", product.name);
    console.log("🛒 ProductCard Debug - User:", user);
    console.log("🛒 ProductCard Debug - Cart Items:", cartItems);
    console.log("🛒 ProductCard Debug - This product in cart:", cartItems[product._id]);
  }, [product._id, user, cartItems]);

  // Mobile detection
  React.useEffect(() => {
    const mobileCheck =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    setIsMobile(mobileCheck);
  }, []);

  const handleProductClick = () => {
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
    scrollTo(0, 0);
  };

  const handleCartAction = (e, action) => {
    e.stopPropagation();
    e.preventDefault();

    console.log(
      "📱 MOBILE DEBUG: Cart action triggered:",
      action,
      "for product:",
      product.name
    );

    if (action === "add") {
      addToCart(product._id);
    } else if (action === "remove") {
      removeFromCart(product._id);
    }
  };

  return (
    product && (
      <div
        onClick={handleProductClick}
        className="flex flex-col h-full border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative pt-[100%] w-full overflow-hidden bg-gray-50">
          <img
            className="absolute top-0 left-0 w-full h-full object-contain p-4 transform hover:scale-105 transition-transform duration-200"
            src={
              product.image?.[0] ||
              product.image ||
              "https://via.placeholder.com/300x200/6C5CE7/FFFFFF?text=Product"
            }
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              console.log(
                "📱 MOBILE DEBUG: Image failed to load for:",
                product.name
              );
              e.target.src =
                "https://via.placeholder.com/300x200/6C5CE7/FFFFFF?text=Product";
            }}
          />
        </div>

        {/* Content Container */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category */}
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>

          {/* Product Name */}
          <h3 className="text-gray-800 font-medium text-lg mb-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="w-4 h-4"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt=""
                />
              ))}
            <span className="text-sm text-gray-500">(4)</span>
          </div>

          {/* Price and Cart Section */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-col">
              <p className="text-lg font-medium text-primary">
                {currency}
                {product.offerPrice}
              </p>
              <p className="text-sm text-gray-500 line-through">
                {currency}
                {product.price}
              </p>
            </div>

            {/* Cart Controls */}
            <div onClick={(e) => e.stopPropagation()} className="text-primary">
              {!user ? (
                <button
                  className={`flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 active:bg-primary/30 border border-primary/40 px-4 py-2 rounded-lg transition-colors ${
                    isMobile ? "touch-manipulation" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log("📱 MOBILE DEBUG: Login button clicked");
                    setShowUserLogin(true);
                  }}
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                  }}
                >
                  <img
                    src={assets.cart_icon}
                    alt="cart_icon"
                    className="w-5 h-5"
                  />
                  <span className="font-medium">Login</span>
                </button>
              ) : !cartItems || !cartItems[product._id] ? (
                <button
                  className={`flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 active:bg-primary/30 border border-primary/40 px-4 py-2 rounded-lg transition-colors ${
                    isMobile ? "touch-manipulation" : ""
                  }`}
                  onClick={(e) => handleCartAction(e, "add")}
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                  }}
                >
                  <img
                    src={assets.cart_icon}
                    alt="cart_icon"
                    className="w-5 h-5"
                  />
                  <span className="font-medium">Add</span>
                </button>
              ) : (
                <div className="flex items-center bg-primary/10 rounded-lg">
                  <button
                    onClick={(e) => handleCartAction(e, "remove")}
                    className={`w-10 h-10 flex items-center justify-center text-xl font-medium hover:bg-primary/20 active:bg-primary/30 rounded-l-lg transition-colors ${
                      isMobile ? "touch-manipulation" : ""
                    }`}
                    style={{
                      WebkitTapHighlightColor: "transparent",
                      touchAction: "manipulation",
                    }}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">
                    {cartItems && cartItems[product._id]
                      ? cartItems[product._id].quantity
                      : 0}
                  </span>
                  <button
                    onClick={(e) => handleCartAction(e, "add")}
                    className={`w-10 h-10 flex items-center justify-center text-xl font-medium hover:bg-primary/20 active:bg-primary/30 rounded-r-lg transition-colors ${
                      isMobile ? "touch-manipulation" : ""
                    }`}
                    style={{
                      WebkitTapHighlightColor: "transparent",
                      touchAction: "manipulation",
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
