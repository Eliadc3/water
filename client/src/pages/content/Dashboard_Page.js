import React, { useEffect, useState } from "react";
import axios from "axios";
import ApexCharts from "apexcharts";

const DashboardPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the server
    axios
      .get("http://localhost:5000/water/getdata")
      .then((response) => {
        const data = response.data;
        console.log(data);

        // Set the data to state
        setData(data);

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
    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  };

  return (
    <div>
      <h2>Stage1: concentrate flow m3h</h2>
      <div id="chart"></div>
    </div>
  );
};

export default DashboardPage;
