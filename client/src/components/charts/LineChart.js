import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const LineChart = ({ chartId, series, title, xCategories }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const options = {
        chart: {
          type: "area",
          height: 350,
        },
        title: {
          text: title,
          align: "center",
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "straight",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
        series: [
          {
            name: title,
            data: series,
            // color: "#F97B22",
          },
        ],
        xaxis: {
          categories: xCategories,
        },
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();
      return () => {
        chart.destroy();
      };
    }
  }, [chartId, series, title, xCategories]);
  return <div ref={chartRef} id={chartId}></div>;
};

export default LineChart;
