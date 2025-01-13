import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { StoreContext } from "../../../context/StoreContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

dayjs.extend(weekOfYear);

const Dashboard = () => {
  const [filter, setFilter] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(dayjs().toDate());
  const [chartData, setChartData] = useState(null);

  const { url, token } = useContext(StoreContext);

  const fetchData = async () => {
    try {
      const formattedDate = dayjs(selectedDate).format(
        filter === "yearly" ? "YYYY" : filter === "monthly" ? "YYYY-MM" : "YYYY-MM-DD"
      );
  
      const response = await axios.get(`${url}/api/admin/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: formattedDate, filter },
      });
  
      processChartData(response.data.orders);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const processChartData = (orders) => {
    console.log("selectedDate:", selectedDate); 
    console.log("processChartData called");
    const groupedData = {};

    if (orders.length === 0) {
      setChartData(null);
      return;
    }
    

    // Initialize groupedData with all possible keys
    if (filter === "yearly") {
      for (let i = 0; i < 12; i++) {
        const month = dayjs().month(i).format("YYYY-MM");
        groupedData[month] = 0;
      }
    } else if (filter === "monthly") {
      const daysInMonth = dayjs(selectedDate).daysInMonth();
      for (let i = 1; i <= daysInMonth; i++) {
        const day = dayjs(selectedDate).date(i).format("DD");
        groupedData[day] = 0;
      }
    } else if (filter === "weekly") {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      daysOfWeek.forEach(day => {
        groupedData[day] = 0;
      });
    } else if (filter === "daily") {
      for (let i = 0; i < 24; i++) {
        const hour = dayjs().hour(i).format("HH");
        groupedData[hour] = 0;
      }
    }

    orders.forEach((order) => {
      const orderDate = dayjs(order.orderDate); // Use `orderDate` field from the order object
      let key;

      switch (filter) {
        case "yearly":
          key = orderDate.format("YYYY-MM");
          break;
        case "monthly":
          key = orderDate.format("DD");
          break;
        case "weekly":
          key = orderDate.format("dddd");
          break;
        case "daily":
        default:
          key = orderDate.format("HH");
          break;
      }

      if (groupedData[key] !== undefined) {
        groupedData[key]++;
      }
    });

    const labels = Object.keys(groupedData);
    const values = Object.values(groupedData);

    console.log("Processed Chart Data:", { labels, values });

    setChartData({
      labels,
      datasets: [
        {
          label: `Orders (${filter})`,
          data: values,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "rgba(75,192,192,1)",
          pointBorderColor: "#fff",
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    });
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedDate(dayjs().toDate());
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, filter, selectedDate]);

  useEffect(() => {
    console.log("chartData state updated:", chartData);
  }, [chartData]);

  const getXAxisLabel = () => {
    switch (filter) {
      case "yearly":
        return "Month";
      case "monthly":
        return "Day";
      case "weekly":
        return "Day of the Week";
      case "daily":
      default:
        return "Hour";
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => `Orders: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: getXAxisLabel(),
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Orders",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard">
      <h2>Order Dashboard</h2>

      <div className="button-container">
      <label className="Choice">Select Date: </label>
      <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat={
            filter === "yearly"
              ? "yyyy"
              : filter === "monthly"
              ? "yyyy-MM"
              : "yyyy-MM-dd"
          }
          showYearPicker={filter === "yearly"}
          showMonthYearPicker={filter === "monthly"}
        />
        <div className="filter-buttons">
        <button onClick={() => handleFilterChange("yearly")}>Yearly</button>
        <button onClick={() => handleFilterChange("monthly")}>Monthly</button>
        <button onClick={() => handleFilterChange("weekly")}>Weekly</button>
        <button onClick={() => handleFilterChange("daily")}>Daily</button>
        </div>
      </div>

      {chartData ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>No Data available for the selected date</p>
      )}
    </div>
  );
};

export default Dashboard;