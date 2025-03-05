import React, { useContext, useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/admin_assets/assets";
import { StoreContext } from "../../../context/StoreContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  //Helper function to format date as DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const fetchAllOrders = async (date) => {
    if (!token) {
      toast.error("Authorization token is missing");
      return;
    }
    try {
      const formattedDate = date ? date.toISOString().split('T')[0] : null;
      const response = await axios.get(`${url}/api/admin/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: formattedDate, filter: "daily" },
      });
      if (response.data.success && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
        console.log("Orders fetched:", response.data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    
    // Don't do anything if "status" placeholder is selected
    if (newStatus === "status") {
      return;
    }
    
    try {
      // Show loading indicator
      toast.info("Updating order status...");
      
      const response = await axios.put(
        `${url}/api/admin/orders/update`,
        {
          orderId,
          status: newStatus,
          date: Date.now()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Update response:", response.data);
      
      if (response.data.success) {
        // After successful update, refresh orders
        await fetchAllOrders(selectedDate);
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Generate and download invoice PDF
  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(33, 33, 33);
    doc.text("Dev Creations - INVOICE", 105, 20, { align: "center" });
    
    // Add invoice info
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);

    // Then update your invoice code
    doc.text(`Invoice Date: ${formatDate(new Date())}`, 20, 40);
    doc.text(`Order ID: ${order._id}`, 20, 48);
    doc.text(`Order Date: ${formatDate(order.orderDate)}`, 20, 56);
    
    // Customer info
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Customer Details:", 20, 70);
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Name: ${order.address?.firstName || ""} ${order.address?.lastName || ""}`, 20, 80);
    doc.text(`Address: ${order.address?.street || ""}, ${order.address?.city || ""}`, 20, 88);
    doc.text(`${order.address?.state || ""} ${order.address?.postalCode || ""}`, 20, 96);
    doc.text(`Phone: ${order.address?.phone || ""}`, 20, 104);
    
    // Order items table
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Order Items:", 20, 120);
    
    const tableColumn = ["Item", "Quantity", "Price", "Discount", "Total"];
    const tableRows = [];
    
    order.items.forEach((item) => {
      const itemData = [
        item.name,
        item.quantity,
        `${item.price}`,
        `${item.discount || 0}`,
        `${(item.price - (item.discount || 0)) * item.quantity}`
      ];
      tableRows.push(itemData);
    });
    
    // Using autotable plugin
    autoTable(doc, {
      startY: 125,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: {
        fillColor: [255, 102, 0],
        textColor: [255, 255, 255]
      }
    });
    
    // Get the final Y position after the table
    const finalY = (doc.lastAutoTable?.finalY || 125) + 10;
    
    // Order summary
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Subtotal: ${order.itemTotal || "N/A"}`, 140, finalY + 10);
    doc.text(`Shipping: ${order.shippingCharge || "N/A"}`, 140, finalY + 18);
    doc.text(`Tax: ${order.salesTax || "N/A"}`, 140, finalY + 26);
    
    let discountOffset = 0;
    if (order.coupon && order.coupon.discountAmount) {
      doc.text(`Discount: -${order.coupon.discountAmount}`, 140, finalY + 34);
      discountOffset = 8;
    }
    
    // Total
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text(`Total Amount: ${order.totalAmount}`, 140, finalY + 34 + discountOffset);
    
    // Payment info
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    const paymentMethod = order.payment?.method === 'cod' ? "Cash on Delivery" : "Online Payment";
    const paymentStatus = order.payment?.status ? "Paid" : "Pending";
    doc.text(`Payment Method: ${paymentMethod}`, 20, finalY + 10);
    doc.text(`Payment Status: ${paymentStatus}`, 20, finalY + 18);
    
    // Order status
    let statusText = "Confirmed";
    if (order.cancelledDate) statusText = "Cancelled";
    else if (order.deliveredDate) statusText = "Delivered";
    else if (order.shippedDate) statusText = "Shipped";
    doc.text(`Order Status: ${statusText}`, 20, finalY + 26);

    // Add customer signature section
    const signatureY = finalY + 70;
    
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    
    // Customer signature line
    doc.line(20, signatureY, 100, signatureY);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text("Customer Signature", 20, signatureY + 5);
    
    // Date line
    doc.line(130, signatureY, 180, signatureY);
    doc.text("Date", 130, signatureY + 5);
    
    // Received by text
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text("I confirm receipt of all items in good condition.", 20, signatureY - 10);
    
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for shopping with Dev Creations", 105, 280, { align: "center" });
    
    // Save the PDF
    doc.save(`Dev_Creations_Invoice_${order._id}.pdf`);
    
    toast.success("Invoice downloaded successfully");
  };

  useEffect(() => {
    if (token && url) {
      fetchAllOrders(selectedDate);
    }
  }, [token, url, selectedDate]);

  // Function to determine the available options for status based on dates
  const getStatusOptions = (order) => {
    // For cancelled orders
    if (order.cancelledDate) {
      return (
        <p
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "5px 5px",
            borderRadius: "5px",
            fontWeight: "bold",
            textAlign: "center",
            margin: "10px auto",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Order Cancelled
        </p>
      );
    }
    
    // For delivered orders
    if (order.deliveredDate) {
      return (
        <p
          style={{
            backgroundColor: "green", // Changed to green for delivered
            color: "white",
            padding: "5px 5px",
            borderRadius: "5px",
            fontWeight: "bold",
            textAlign: "center",
            margin: "10px auto",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Order Delivered
        </p>
      );      
    }
    
    // For shipped orders - only allow changing to delivered
    if (order.shippedDate) {
      return (
        <select
          onChange={(event) => statusHandler(event, order._id)}
          value={order.status === "Delivered" ? "delivered" : "shipped"}
          className="status-select"
        >
          <option value="shipped" disabled>Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      );
    }
    
    // For regular orders - show all options
    if (order.orderDate) {
      return (
        <select
          onChange={(event) => statusHandler(event, order._id)}
          value={order.status ? order.status.toLowerCase() : "status"}
          className="status-select"
        >
          <option value="status">Select Status</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      );
    }
    
    return null;
  };

  // Function to determine payment status display text
  const getPaymentStatusText = (order) => {
    if (!order.payment) return "Unknown";
    
    if (order.payment.method === 'cod') {
      return "Cash on Delivery";
    }
    
    return order.payment.status ? "Paid Online" : "Payment Failed";
  };

  // Function to check if order can be processed (either COD or paid online)
  const canProcessOrder = (order) => {
    return order.payment?.method === 'cod' || order.payment?.status;
  };

  return (
    <div className="order add">
      <h3>Order <span>Page</span></h3>
      <div className="date-picker-container">
        <label className="Choice">Select Date: </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>
    {orders.length > 0 ? (
      <div className="order-list">
        {orders.slice().reverse().map((order, index) => (
          <div key={order._id || index} className="order-item">
            <img src={assets.parcel_icon} alt="Order Parcel Icon" onClick={()=> navigate(`/admin/package/${order._id}`)}/>
            <div>
              <p className="order-item-food">
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}
                    {idx !== order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p className="order-item-name">
                {order.address?.firstName || "N/A"}{" "}
                {order.address?.lastName || ""}
              </p>
              <div className="order-item-address">
                <p>{order.address?.street || "N/A"},</p>
                <p>{order.address?.city || "N/A"}</p>
              </div>
              <div className="order-item-address">
              <p>{order.address?.state || "N/A"}</p>
              <p>{order.address?.postalCode || "N/A"}</p>
              </div>
              <p className="order-item-phone">{order.address?.phone || "N/A"}</p>
              {/* Download Invoice Button - added here to maintain layout */}
              <button 
                onClick={() => downloadInvoice(order)} 
                className="download-invoice-btn"
              >
                Download Invoice
              </button>
            </div>
            <p>Items: {order.items.length}</p>
            <p>&#8377;{order.totalAmount}</p>
            <p>
              Payment: {getPaymentStatusText(order)}
            </p>
            <p>Order Date: {formatDate(order.orderDate)}</p>
            {canProcessOrder(order) && (
              <>
                {order.estimatedDate && (
                  <p>
                    Estimated Delivery:{" "}
                    {formatDate(order.estimatedDate)}
                  </p>
                )}
                {order.cancelledDate && (
                  <p>Cancelled Date: {formatDate(order.cancelledDate)}</p>
                )}
                {order.shippedDate && (
                  <p>Shipped Date: {formatDate(order.shippedDate)}</p>
                )}
                {order.deliveredDate && (
                  <p>
                    Delivered Date: {formatDate(order.deliveredDate)}
                  </p>
                )}
                {getStatusOptions(order)}
              </>
            )}
            {!canProcessOrder(order) && <p style={{
              backgroundColor: "black",
              color: "white",
              padding: "5px 5px",
              borderRadius: "5px",
              minWidth: "100px",
              fontWeight: "bold",
              textAlign: "center",
              margin: "10px auto",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}>Order Failed</p>}
          </div>
        ))}
      </div>
    ) : (
      <p>No orders found</p>
    )}  
    </div>
  );
};

export default Orders;