import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const Charts = () => {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Perform the data fetching here
        const response = await fetch(
          "http://localhost:5000/water/manipulations"
        );
        const chartData = await response.json();
        // const chartData = jsonData.map((item) => ({
        //   x: item.Time,
        //   y: item.Stage1_concentrate_flow_m3h,
        // }));
        console.log(chartData);
        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  //   const options = {
  //     chart: {
  //       id: "apexchart-example",
  //     },
  //     xaxis: {
  //       categories: chartData.map((item) => item.x),
  //     },
  //   };
  //   const series = [
  //     {
  //       name: "Concentrate Flow",
  //       data: chartData.map((item) => item.x),
  //     },
  //   ];

  return (
    <div>
      {/* <Chart options={options} series={series} type="line" />
      <div key={Time}>data:{item}</div> */}

      {chartData.map((item, index) => (
        <div key={index}>
          <p>Date: {item.date}</p>
          <p>Stage1_concentrate_flow_m3h: {item.Stage1_concentrate_flow_m3h}</p>
        </div>
      ))}
    </div>
  );
};

export default Charts;
