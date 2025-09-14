import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    console.log("Creating COD order:", { userId, items, address });

    if (!address || items.length === 0) {
      console.log("Invalid data - address or items missing");
      return res.json({ success: false, message: "Invalid data" });
    }

    // Calculate Amount Using Items
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        amount += product.offerPrice * item.quantity;
        console.log(`Product ${product.name}: ${product.offerPrice} x ${item.quantity} = ${product.offerPrice * item.quantity}`);
      } else {
        console.log(`Product not found for ID: ${item.product}`);
      }
    }

    // Add Tax Charge (2%)
    const taxAmount = Math.floor(amount * 0.02);
    amount += taxAmount;
    console.log(`Subtotal: ${amount - taxAmount}, Tax: ${taxAmount}, Total: ${amount}`);

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      isPaid: true, // COD orders are considered paid
    };
    
    console.log("Creating order with data:", orderData);

    const order = await Order.create(orderData);

    console.log("Order created successfully:", order._id);
    console.log("Order details:", order);
    
    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.error("Error creating COD order:", error);
    return res.json({ success: false, message: error.message });
  }
};

// Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let productData = [];

    // Calculate Amount Using Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    // Stripe Gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // create line items for stripe

    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
        },
        quantity: item.quantity,
      };
    });

    // create session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
// Stripe Webhooks to Verify Payments Action : /stripe
export const stripeWebhooks = async (request, response) => {
  // Stripe Gateway Initialize
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { orderId, userId } = session.metadata;

        // Mark Payment as Paid
        await Order.findByIdAndUpdate(orderId, { isPaid: true });
        // Clear user cart
        await User.findByIdAndUpdate(userId, { cartItems: {} });
        console.log(`✅ Order ${orderId} marked as paid`);
        break;
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Getting Session Metadata
        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!session.data || session.data.length === 0) {
          console.error(
            `No session found for payment intent ${paymentIntentId}`
          );
          break;
        }

        const { orderId, userId } = session.data[0].metadata;
        // Mark Payment as Paid
        await Order.findByIdAndUpdate(orderId, { isPaid: true });
        // Clear user cart
        await User.findByIdAndUpdate(userId, { cartItems: {} });
        console.log(`✅ Payment succeeded for order ${orderId}`);
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Getting Session Metadata
        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!session.data || session.data.length === 0) {
          console.error(
            `No session found for payment intent ${paymentIntentId}`
          );
          break;
        }

        const { orderId } = session.data[0].metadata;
        await Order.findByIdAndDelete(orderId);
        console.log(`❌ Payment failed for order ${orderId}`);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    return response.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return response.status(500).json({ error: "Webhook processing failed" });
  }
};

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("Fetching orders for userId:", userId);

    // Get all orders for this user (no filters for now)
    const orders = await Order.find({ userId })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    console.log("Found orders:", orders.length);
    console.log("Orders:", orders);

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get All Orders ( for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
