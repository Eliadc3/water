import React, { useContext, useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { ThemeContext } from "../themes/ThemeContext";
import axios from "axios";

const LineChart = ({ chartId, series, baselineSeries, title, xCategories }) => {
  const chartRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const themeColor = theme === "dark" ? "#ffffff" : "#000000";

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
          style: {
            color: `${theme === "dark" ? "#ffffff" : "#000000"}`,
          },
        },

        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "straight",
        },
        grid: {
          row: {
            colors: ["#F6F1F1", "transparent"],
            opacity: 0.5,
          },
        },
        series: [
          {
            name: title,
            data: series,
            style: {
              color: themeColor,
            },
            dataLabels: {
              enabled: true,
            },
          },
          {
            name: "Baseline",
            data: baselineSeries,
            style: {
              color: "red",
            },
            dataLabels: {
              enabled: true,
            },
          },
        ],
        xaxis: {
          categories: xCategories,
          labels: {
            style: {
              colors: themeColor,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: themeColor,
            },
          },
        },
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();
      return () => {
        chart.destroy();
      };
    }
  }, [chartId, series, baselineSeries, title, xCategories, theme]);
  return (
    <div
      style={{
        color: "#000000",
      }}
      ref={chartRef}
      id={chartId}
    ></div>
  );
};

export default LineChart;
