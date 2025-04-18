import { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import { LogOut } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const dummyOrders = [
  {
    _id: "661111111111111111111111",
    restaurantId: "67fbcc3c4621fd9165994e13",
    tableId: "67fbcc3c4621fd9165994aaa",
    customer: {
      name: "John Doe",
      phone: "1234567890",
    },
    items: [
      { name: "Pizza", price: 150, quantity: 2, total: 300 },
      { name: "Garlic Bread", price: 80, quantity: 1, total: 80 },
    ],
    totalAmount: 380,
    status: "pending",
    createdAt: "2024-07-13T12:00:00Z",
    updatedAt: "2024-07-13T12:00:00Z",
  },
  {
    _id: "662222222222222222222222",
    restaurantId: "67fbcc3c4621fd9165994e13",
    tableId: "67fbcc3c4621fd9165994bbb",
    customer: {
      name: "John Doe",
      phone: "1234567890",
    },
    items: [
      { name: "Burger", price: 70, quantity: 2, total: 140 },
      { name: "Fries", price: 50, quantity: 1, total: 50 },
    ],
    totalAmount: 190,
    status: "preparing",
    createdAt: "2024-07-13T12:15:00Z",
    updatedAt: "2024-07-13T12:17:00Z",
  },
  {
    _id: "664444444444444444444444",
    restaurantId: "67fbcc3c4621fd9165994e13",
    tableId: "67fbcc3c4621fd9165994ddd",
    customer: {
      name: "John Doe",
      phone: "1234567890",
    },
    items: [
      { name: "Pasta", price: 180, quantity: 1, total: 180 },
      { name: "Lemonade", price: 40, quantity: 2, total: 80 },
    ],
    totalAmount: 260,
    status: "served",
    createdAt: "2024-07-13T12:45:00Z",
    updatedAt: "2024-07-13T12:50:00Z",
  },
];

function Home() {
  const [orders, setOrders] = useState(dummyOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const resturantId = "67fbcc3c4621fd9165994e13";
  const orderStatuses = ["pending", "preparing", "served"];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTakeOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId
          ? {
              ...order,
              status: "preparing",
              items: order.items.map((item) => ({ ...item, completed: false })),
            }
          : order
      )
    );
  };

  const markItemComplete = (orderId, itemIndex) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order._id === orderId) {
          const updatedItems = [...order.items];
          updatedItems[itemIndex].completed = true;

          const allCompleted = updatedItems.every((item) => item.completed);

          return {
            ...order,
            items: updatedItems,
            status: allCompleted ? "ready" : order.status,
          };
        }
        return order;
      })
    );
  };

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${API_URL}/api/kitchen/orders?restaurantId=${resturantId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //       console.log(response);
  //       if (response.data.success) {
  //         setOrders(response.data.orders);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch orders:", error);
  //     }
  //   };
  //   fetchOrders();
  // }, []);

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Kitchen Orders</h2>
        <LogOut
          style={{
            cursor: "pointer",
          }}
          color="white"
          size={"2.2rem"}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        />
      </div>
      <div className="home-body">
        <div className="home-body-top-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Search by customer name or order ID"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="home-body-orders">
          {orderStatuses.map((status) => (
            <div key={status} className="order-section">
              <h3 className="order-section-title">
                {status.charAt(0).toUpperCase() + status.slice(1)} Orders
              </h3>
              <div className="order-section-grid">
                {orders
                  .filter((order) => order.status === status)
                  .filter(
                    (order) =>
                      order.customer.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      order._id
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((order) => (
                    <div key={order._id} className="order-card">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          marginBottom: "0rem",
                        }}
                      >
                        <h4>Order ID: {order._id.slice(-5).toUpperCase()}</h4>
                        <p className="order-count">
                          {order.items.length} Items
                        </p>
                      </div>
                      <p>
                        <strong>Status:</strong> {order.status}
                      </p>
                      <p>
                        <strong>Customer:</strong> {order.customer.name}
                      </p>
                      <p>
                        <strong>Phone:</strong> {order.customer.phone}
                      </p>
                      <p>
                        <strong>Total:</strong> ₹{order.totalAmount}
                      </p>
                      <ul>
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} x{item.quantity} = ₹{item.total}
                            {order.status === "preparing" && (
                              <>
                                <button
                                  className={`btn-order ${
                                    item.completed
                                      ? "btn-completed"
                                      : "btn-warning"
                                  }`}
                                  onClick={() =>
                                    markItemComplete(order._id, idx)
                                  }
                                  disabled={item.completed}
                                >
                                  {item.completed
                                    ? "Completed"
                                    : "Mark Complete"}
                                </button>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                      <p className="order-time">
                        Created:{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                      {order.status === "pending" && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleTakeOrder(order._id)}
                        >
                          Take Order
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
