import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/ui/Card";
import styles from "../css/Dashboard_Page.module.css";
import LineChart from "../../components/charts/LineChart";
import UploadFile from "../../components/services/UploadFile";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [baselineChartData, setBaselineChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("");
  const [uploadForm, setUploadForm] = useState(false);
  const [showUploadFormButton, setShowUploadFormButton] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchData("http://localhost:5000/water/getdailydata");
  }, []);
  // useEffect(() => {
  //   const cachedData = getCachedData();
  //   if (cachedData) {
  //     setChartData(cachedData.chartData);
  //     setBaselineChartData(cachedData.baselineChartData);
  //     setIsLoading(false);
  //   } else {
  //
  //   }
  // }, []);

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      const data = response.data;

      const chartData = Object.keys(data[0].average).map((field) => ({
        chartId: field,
        series: data.map((chart) => chart.average[field]),
        title: field.replace(/_/g, " "),
        xCategories: data.map((chart) => chart.date),
      }));
      setChartData(chartData);
      setIsLoading(false);

      //------------------------BASELINE----------------------------------------------//
      const baselineResponse = await axios.get(
        "http://localhost:5000/water/baseline"
      );
      const baselineData = baselineResponse.data;

      const dataLength = data.length;
      const propertyNames = Object.keys(baselineData[0]).filter(
        (key) => key !== "_id"
      );

      const separateArrays = {};
      for (let i = 0; i < propertyNames.length; i++) {
        const propertyName = propertyNames[i];
        separateArrays[propertyName] = Array(dataLength).fill(
          baselineData[0][propertyName]
        );
      }
      console.log(separateArrays);

      const baselineChartData = Object.keys(separateArrays).map((field) => ({
        chartId: field,
        baselineSeries: separateArrays[field],
      }));

      setBaselineChartData(baselineChartData);
      //---------------------------------------------------------------------//
      // cachedData(chartData, baselineChartData);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  // const cachedData = (chartData, baselineChartData) => {
  //   const cachedData = {
  //     chartData,
  //     baselineChartData,
  //   };
  //   localStorage.setItem("dashboardData", JSON.stringify(cachedData));
  // };

  // const getCachedData = () => {
  //   const cachedData = localStorage.getItem("dashboardData");
  //   return cachedData ? JSON.parse(cachedData) : null;
  // };

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

  const onClickUploadForm = () => {
    setUploadForm(!uploadForm);
    setShowUploadFormButton(false);
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.uploadFile}>{uploadForm && <UploadFile />}</div>

        {isLoading ? (
          <h2 className={styles.renderMessage}>
            {" "}
            Rendering data, please wait...
          </h2>
        ) : chartData.length !== 0 ? (
          <div className={styles.data}>
            <div className={styles.timeRange}>
              <h2>
                Period average:{" "}
                <a className={styles.selectedtimeRange}>{selectedTimeRange}</a>
              </h2>
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
          <div>
            <div>
              <h2 className={styles.renderMessage}>
                No data to display, please upload file.
              </h2>
            </div>
            <div className={styles.uploadFormbtn}>
              {showUploadFormButton && (
                <button
                  className={styles.btn}
                  onClick={() => onClickUploadForm(uploadForm)}
                >
                  Upload File
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
