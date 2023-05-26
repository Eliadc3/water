import React, { useState, useEffect } from "react";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";

const Graph = () => {
  const [chartOptions, setChartOptions] = useState({});
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Perform the data fetching here
        const response = await fetch(
          "http://localhost:5000/water/manipulations"
        );
        console.log("response: " + response);
        if (response.ok) {
          const jsonData = await response.json();

          // console.log(jsonData);

          // // Process the jsonData and extract the necessary data for the chart
          const chartData = jsonData.map((item) => ({
            x: item.Time,
            y: item.Stage1_concentrate_flow_m3h,
          }));

          // Update the chart options and series state variables
          setChartOptions({
            chart: {
              type: "line",
            },
            xaxis: {
              categories: chartData.map((item) => item.x),
            },
            // Add any additional chart options here
          });
          setSeries([
            {
              name: "Concentrate Flow",
              data: chartData.map((item) => item.y),
            },
          ]);
        } else {
          throw new Error("Request failed with status: " + response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const chart = new ApexCharts(
      document.querySelector("#chart"),
      chartOptions
    );
    chart.render();
  }, [chartOptions]);
  // Rest of the component code when data is available
  return (
    <div>
      <script src="https://cdn.jsdelivr.net/npm/apexcharts@latest"></script>
      <div id="chart"></div>
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default Graph;
