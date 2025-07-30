import User from "../models/User.js";

// Update User CartData : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cartItems },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: "Cart Updated", user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Add to cart : /api/cart/add
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.body.userId;

    console.log("Adding to cart:", { productId, userId });

    // Use findByIdAndUpdate for atomic operation
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Get current cart items
    const currentCartItems = user.cartItems || {};
    console.log("Current cartItems:", currentCartItems);

    // Create updated cart items
    const updatedCartItems = { ...currentCartItems };

    // Add or increment the product in cart
    if (updatedCartItems[productId]) {
      updatedCartItems[productId].quantity += 1;
      console.log(
        "Incremented quantity for",
        productId,
        "to",
        updatedCartItems[productId].quantity
      );
    } else {
      updatedCartItems[productId] = { quantity: 1 };
      console.log("Added new item", productId, "with quantity 1");
    }

    // Update the user with the new cart items
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cartItems: updatedCartItems },
      { new: true, runValidators: true }
    );

    console.log("Updated user cart:", updatedUser.cartItems);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from cart : /api/cart/remove
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Get current cart items
    const currentCartItems = user.cartItems || {};

    // Create updated cart items
    const updatedCartItems = { ...currentCartItems };

    // Remove the product from cart
    if (updatedCartItems[productId]) {
      delete updatedCartItems[productId];
    }

    // Update the user with the new cart items
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cartItems: updatedCartItems },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
