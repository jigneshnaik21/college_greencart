import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching orders for user:", user._id);
      console.log("User object:", user);

      // Send userId in request body as expected by backend
      const { data } = await axios.post("/api/order/user", {
        userId: user._id,
      });
      console.log("Orders response:", data);

      if (data.success) {
        setMyOrders(data.orders);
        console.log("Set orders:", data.orders);
        console.log("Orders length:", data.orders.length);
      } else {
        setError(data.message);
        console.log("Orders request failed:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      console.error("Error details:", error.response?.data);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [user, axios]);

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user, fetchMyOrders]);

  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {/* Debug info */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p>User ID: {user?._id}</p>
        <p>Orders count: {myOrders.length}</p>
        <p>User authenticated: {user ? "Yes" : "No"}</p>
        <p>
          Authorization header:{" "}
          {axios.defaults.headers.common["Authorization"]
            ? "Present"
            : "Missing"}
        </p>
        <p>Loading: {loading ? "Yes" : "No"}</p>
        {error && <p className="text-red-500">Error: {error}</p>}
        <button
          onClick={fetchMyOrders}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh Orders"}
        </button>
      </div>

      {myOrders.length === 0 && !loading && !error && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400">
            Place your first order to see it here!
          </p>
        </div>
      )}

      {myOrders.map((order, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
            <span>OrderId : {order._id}</span>
            <span>Payment : {order.paymentType}</span>
            <span>
              Total Amount : {currency}
              {order.amount}
            </span>
          </p>
          {order.items.map((item, index) => (
            <div
              key={index}
              className={`relative bg-white text-gray-500/70 ${
                order.items.length !== index + 1 && "border-b"
              } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <img
                    src={item.product.image[0]}
                    alt=""
                    className="w-16 h-16"
                  />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-medium text-gray-800">
                    {item.product.name}
                  </h2>
                  <p>Category: {item.product.category}</p>
                </div>
              </div>

              <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                <p>Quantity: {item.quantity || "1"}</p>
                <p>Status: {order.status}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-primary text-lg font-medium">
                Amount: {currency}
                {item.product.offerPrice * item.quantity}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
