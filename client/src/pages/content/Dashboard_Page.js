import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/ui/Card";
import styles from "./Dashboard_Page.module.css";
import LineChart from "../../components/charts/LineChart";
import UploadFile from "../../components/services/UploadFile";
import { useNavigate } from "react-router-dom";

const DashboardPage = ({ authenticated }) => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [baselineChartData, setBaselineChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("");

  useEffect(() => {
    if (!authenticated) navigate("/login");
    else {
      fetchData("http://localhost:5000/water/getdailydata");
    }
  }, []);

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

      const baselineResponse = await axios.get(
        "http://localhost:5000/water/baseline"
      );
      const baselineData = baselineResponse.data;

      //console.log(baselineData);

      const dataLength = data.length;
      //----------------------------------------------------------------------//
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
      //---------------------------------------------------------------------//
      console.log(separateArrays);

      const baselineChartData = Object.keys(separateArrays).map((field) => ({
        chartId: field,
        baselineSeries: separateArrays[field],
      }));

      setBaselineChartData(baselineChartData);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const onClickTimeRange = async (timeRange) => {
    const url =
      timeRange === "daily"
        ? "http://localhost:5000/water/getdailydata"
        : timeRange === "weekly"
        ? "http://localhost:5000/water/getweeklydata"
        : "http://localhost:5000/water/getmonthlydata";
    fetchData(url);
    setSelectedTimeRange(timeRange);
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <Card>
          <UploadFile />
        </Card>
        {isLoading ? (
          <h2> Rendering data, please wait...</h2>
        ) : chartData.length === 0 ? (
          <h2>No data to display, please upload file.</h2>
        ) : (
          <div>
            <Card>
              <h3>Choose a period average to display:</h3>
              {selectedTimeRange && (
                <h3>selected time range: {selectedTimeRange}</h3>
              )}
              <button
                className={styles.btn}
                onClick={() => onClickTimeRange("daily")}
              >
                Daily
              </button>
              <button
                className={styles.btn}
                onClick={() => onClickTimeRange("weekly")}
              >
                Weekly
              </button>
              <button
                className={styles.btn}
                onClick={() => onClickTimeRange("monthly")}
              >
                Monthly
              </button>
            </Card>

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
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
