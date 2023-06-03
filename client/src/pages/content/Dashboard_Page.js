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
      .get("http://localhost:5000/water/getdailydata")
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
    // Configure ApexCharts options
    var options = {
      series: [
        {
          name: "Stage1 concentrate flow",
          type: "line",
          data: data.map(
            (record) => record.average.Stage1_concentrate_flow_m3h
          ),
        },
      ],
      chart: {
        type: "line",
        height: 350,
      },
      stroke: {
        width: 3,
      },
      title: {
        text: "m³h",
      },

      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: data.map((record) => record.date),
      },
    };

    // Render the chart using ApexCharts
    const chart = new ApexCharts(
      document.querySelector("#Stage1_concentrate_flow_m3h"),
      options
    );
    chart.render();

    // Render the chart using ApexCharts
    const chart2 = new ApexCharts(
      document.querySelector("#Stage2_concentrate_factor"),
      options
    );
    chart2.render();
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.grid}>
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
