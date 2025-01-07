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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState(null);

  const { url, token } = useContext(StoreContext);

  const fetchData = async () => {
    try {
      const formattedDate = dayjs(selectedDate).format(
        filter === "yearly" ? "YYYY" : filter === "monthly" ? "YYYY-MM" : "YYYY-MM-DD"
      );

      const response = await axios.get(url + "/api/admin/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched data:", response.data);
      processChartData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const processChartData = (data) => {
    const groupedData = {};

    data.forEach((order) => {
      const orderDate = dayjs(order.date); // Assuming `order.date` is valid
      let key;

      switch (filter) {
        case "yearly":
          key = orderDate.format("YYYY");
          break;
        case "monthly":
          key = orderDate.format("YYYY-MM");
          break;
        case "weekly":
          key = `Week ${orderDate.week()} of ${orderDate.format("YYYY")}`;
          break;
        case "daily":
        default:
          key = orderDate.format("YYYY-MM-DD");
          break;
      }

      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key]++;
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
    setSelectedDate(new Date());
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, filter, selectedDate]);

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
          text: "Date",
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

      <div>
        <button onClick={() => handleFilterChange("yearly")}>Yearly</button>
        <button onClick={() => handleFilterChange("monthly")}>Monthly</button>
        <button onClick={() => handleFilterChange("weekly")}>Weekly</button>
        <button onClick={() => handleFilterChange("daily")}>Daily</button>
      </div>

      <div style={{ margin: "20px 0" }}>
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
      </div>

      {chartData ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default Dashboard;
