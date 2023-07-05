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
          type: "line",
          height: 350,
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
        },

        dataLabels: {
          enabled: true,
          formatter: function(val, { seriesIndex }) {
            return seriesIndex === 0 ? val.toString() : "";
          },
        },
        title: {
          text: title,
          align: "center",
          style: {
            color: `${theme === "dark" ? "#ffffff" : "#000000"}`,
          },
        },

        fill: {
          type: "solid",
          opacity: [0.35, 1],
        },
        stroke: {
          curve: "smooth",
        },
        grid: {
          row: {
            colors: ["#F6F1F1", "transparent"],
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        series: [
          {
            name: title,
            type: "area",
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
            type: "line",
            data: baselineSeries,
            showDataLabels: false,
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
        tooltip: {
          shared: true,
          intersect: false,
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
