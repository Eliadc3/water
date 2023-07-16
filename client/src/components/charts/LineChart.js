import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const LineChart = ({ chartId, series, baselineSeries, title, xCategories }) => {
  const chartRef = useRef(null);
  const textColor = "black";

  useEffect(() => {
    if (chartRef.current) {
      const options = {
        chart: {
          type: "line",
          height: 350,
          dropShadow: {
            enabled: true,
            color: "blue",
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
            color: textColor,
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
              color: textColor,
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
              colors: textColor,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: textColor,
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
  }, [chartId, series, baselineSeries, title, xCategories]);
  return (
    <div
      style={{
        color: textColor,
      }}
      ref={chartRef}
      id={chartId}
    ></div>
  );
};

export default LineChart;
