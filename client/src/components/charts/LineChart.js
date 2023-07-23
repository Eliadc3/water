import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

// LineChart component takes the following props:
// - chartId: The HTML element id where the chart will be rendered.
// - series: An array of data points representing the main line series of the chart.
// - baselineSeries: An array of data points representing a secondary baseline line series.
// - title: The title of the chart.
// - xCategories: An array of categories for the x-axis.
const LineChart = ({ chartId, series, baselineSeries, title, xCategories }) => {
  // Create a ref to hold the reference to the chart's HTML element.
  const chartRef = useRef(null);
  // Define the text color for the chart (used for labels, titles, etc.).
  const textColor = "black";

  // useEffect hook to initialize and update the chart when the component mounts or receives new props.
  useEffect(() => {
    // Check if the chartRef has been assigned (non-null).
    if (chartRef.current) {
      // Options configuration for the ApexCharts instance.
      const options = {
        // Chart configuration.
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

        // DataLabels configuration.
        dataLabels: {
          enabled: true,
          // Custom formatting function for data labels.
          // Show data labels for the main line series (seriesIndex === 0) and hide others.
          formatter: function(val, { seriesIndex }) {
            return seriesIndex === 0 && val !== null ? val.toString() : "";
          },
        },

        // Chart title configuration.
        title: {
          text: title,
          align: "center",
          style: {
            color: textColor,
          },
        },

        // Area fill configuration.
        fill: {
          type: "solid",
          opacity: [0.35, 1],
        },

        // Line stroke configuration.
        stroke: {
          curve: "smooth",
        },

        // Grid configuration.
        grid: {
          row: {
            colors: ["gray", "transparent"],
            opacity: 0.5,
          },
        },

        // Marker configuration.
        markers: {
          size: 1,
        },

        // Series configuration.
        series: [
          {
            name: title,
            type: "area",
            data: series, // Data points for the main line series.
            style: {
              color: textColor,
            },
            dataLabels: {
              enabled: true, // Enable data labels for the main line series.
            },
          },
          {
            name: "Baseline",
            type: "line",
            data: baselineSeries, // Data points for the baseline line series.
            showDataLabels: false, // Hide data labels for the baseline series.
          },
        ],

        // X-axis configuration.
        xaxis: {
          categories: xCategories,
          labels: {
            style: {
              colors: textColor,
            },
          },
        },

        // Y-axis configuration.
        yaxis: {
          labels: {
            style: {
              colors: textColor,
            },
          },
        },

        // Tooltip configuration.
        tooltip: {
          shared: true,
          intersect: false,
        },
      };

      // Create a new ApexCharts instance with the provided options and bind it to the chartRef element.
      const chart = new ApexCharts(chartRef.current, options);
      // Render the chart.
      chart.render();
      // Clean up function to destroy the chart when the component unmounts.
      return () => {
        chart.destroy();
      };
    }
  }, [chartId, series, baselineSeries, title, xCategories]);

  // Return the chart container div with the assigned ref and id.
  return (
    <div
      style={{
        color: textColor, // Set the color of the chart container.
      }}
      ref={chartRef}
      id={chartId} // Set the id of the chart container.
    ></div>
  );
};

export default LineChart;
