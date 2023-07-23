import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/ui/Card";
import styles from "../css/Dashboard_Page.module.css";
import LineChart from "../../components/charts/LineChart";
import UploadFile from "../../components/services/UploadFile";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// The DashboardPage component represents a dashboard page that displays line charts based on the fetched data.
// It allows users to select different time ranges (daily, weekly, monthly) to view the average data over that period.
// Users can also upload a file using the "Upload File" button.
const DashboardPage = () => {
  const navigate = useNavigate();

  // State variables for chart data and baseline chart data
  const [chartData, setChartData] = useState([]);
  const [baselineChartData, setBaselineChartData] = useState([]);

  // State variable for loading status
  const [isLoading, setIsLoading] = useState(true);

  // State variable for the selected time range
  const [selectedTimeRange, setSelectedTimeRange] = useState("Daily");

  // State variable for showing/hiding the upload form
  const [uploadForm, setUploadForm] = useState(false);

  // Check authentication when the component mounts
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData("http://localhost:5000/water/getdailydata");
  }, []);

  // Function to fetch data from the server based on the provided URL
  const fetchData = async (url) => {
    try {
      // Fetch data using axios
      const response = await axios.get(url);
      const data = response.data;

      // Process fetched data to generate chart data
      const chartData = Object.keys(data[0].average).map((field) => ({
        chartId: field,
        series: data.map((chart) => chart.average[field]),
        title: field.replace(/_/g, " "),
        xCategories: data.map((chart) => chart.date),
      }));
      setChartData(chartData);
      setIsLoading(false);

      //------------------------BASELINE----------------------------------------------//
      // Fetch baseline data
      const baselineResponse = await axios.get(
        "http://localhost:5000/water/baseline"
      );
      const baselineData = baselineResponse.data;

      const dataLength = data.length;
      const propertyNames = Object.keys(baselineData[0]).filter(
        (key) => key !== "_id"
      );

      // Create an object to hold separate arrays for each baseline chart data
      const separateArrays = {};
      for (let i = 0; i < propertyNames.length; i++) {
        const propertyName = propertyNames[i];
        separateArrays[propertyName] = Array(dataLength).fill(
          baselineData[0][propertyName]
        );
      }
      console.log(separateArrays);

      // Create baseline chart data
      const baselineChartData = Object.keys(separateArrays).map((field) => ({
        chartId: field,
        baselineSeries: separateArrays[field],
      }));

      setBaselineChartData(baselineChartData);
      //---------------------------------------------------------------------//
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  // Function to handle the click event of time range buttons
  const onClickTimeRange = async (timeRange) => {
    const url =
      timeRange === "Daily"
        ? "http://localhost:5000/water/getdailydata"
        : timeRange === "Weekly"
        ? "http://localhost:5000/water/getweeklydata"
        : "http://localhost:5000/water/getmonthlydata";
    fetchData(url);
    setSelectedTimeRange(timeRange);
  };

  // Function to handle the click event of the "Upload File" button
  const onClickUploadForm = () => {
    setUploadForm(!uploadForm);
  };

  return (
    <div className={styles.body}>
      {/* Render the page header */}
      <div className={styles.pageName}>
        <h2>Dashboard</h2>
      </div>
      <div className={styles.container}>
        {/* Render the "Upload File" button */}
        <div className={styles.uploadFormbtn}>
          <button className={styles.btn} onClick={onClickUploadForm}>
            <i class="fa fa-arrow-up" aria-hidden="true" /> Upload File
          </button>
        </div>
        {/* Render the UploadFile component if uploadForm is true */}
        <div className={styles.uploadFile}>{uploadForm && <UploadFile />}</div>
        {/* Render charts or a loading message based on isLoading */}
        {isLoading ? (
          <h2 className={styles.renderMessage}>
            Rendering data, please wait...
          </h2>
        ) : (
          <div>
            {chartData.length !== 0 ? (
              <div className={styles.data}>
                {/* Render time range selection */}
                <div className={styles.timeRange}>
                  <h2>
                    Period Average:{" "}
                    <a className={styles.selectedtimeRange}>
                      {selectedTimeRange}
                    </a>
                  </h2>
                  <div className={styles.timeRangeButtons}>
                    <button
                      className={styles.btn}
                      onClick={() => onClickTimeRange("Daily")}
                    >
                      Daily
                    </button>
                    <button
                      className={styles.btn}
                      onClick={() => onClickTimeRange("Weekly")}
                    >
                      Weekly
                    </button>
                    <button
                      className={styles.btn}
                      onClick={() => onClickTimeRange("Monthly")}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                {/* Render the charts */}
                <div className={styles.grid}>
                  {chartData.map((chart) => (
                    <Card key={chart.chartId}>
                      <LineChart
                        key={chart.chartId}
                        chartId={chart.chartId}
                        series={chart.series}
                        baselineSeries={
                          baselineChartData.find(
                            (data) => data.chartId === chart.chartId
                          )
                            ? baselineChartData.find(
                                (data) => data.chartId === chart.chartId
                              ).baselineSeries
                            : []
                        }
                        title={chart.title}
                        xCategories={chart.xCategories}
                      />
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              // Render a message if no data is available
              <div>
                <h2 className={styles.renderMessage}>
                  No data to display, please upload file.
                </h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default DashboardPage;
