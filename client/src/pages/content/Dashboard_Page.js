import React, { useEffect, useState } from "react";
import axios from "axios";
import ApexCharts from "apexcharts";
import Card from "../../components/ui/Card";
import styles from "./Dashboard_Page.module.css";

const DashboardPage = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetch data from the server

    axios
      .get("http://localhost:5000/water/getdata")
      .then((response) => {
        const data = response.data;
        console.log(data);

        // Set the data to state
        setChartData(data);

        // Render the chart
        renderChart(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        console.log("Response:", error.response);
      });
  }, []);

  const renderChart = (data) => {
    // Prepare the chart series
    const series = [
      {
        name: "Stage1_concentrate_flow_m3h",
        data: data.map((record) => record.Stage1_concentrate_flow_m3h),
      },

      // Add more series as per your data fields
    ];

    // Configure ApexCharts options
    const options = {
      chart: {
        type: "line",
        height: 350,
      },
      series: series,
      xaxis: {
        categories: data.map((record) => record.Time),
      },
    };

    // Render the chart using ApexCharts
    const chart = new ApexCharts(
      document.querySelector("#Stage1_concentrate_flow_m3h"),
      options
    );
    chart.render();
  };

  return (
    <div className={styles.body}>
      <div className="container">
        <div className="grid">
          <Card>
            <h2>Stage1: concentrate flow (m³h)</h2>
            <div id="Stage1_concentrate_flow_m3h"></div>
          </Card>
          <Card>
            <h2>Stage2: concentrate factor</h2>
            <div id="Stage2_concentrate_factor"></div>
          </Card>
          <Card>
            <h2>Stage1: feed TDS (mg/l)</h2>
            <div id="Stage1_feed_TDS_mgl"></div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
