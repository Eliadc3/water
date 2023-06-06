import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/ui/Card";
import styles from "./Dashboard_Page.module.css";
import LineChart from "../../components/charts/LineChart";

const DashboardPage = () => {
  const [chartData, setChartData] = useState([]);

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
      console.log(data);
      setChartData(chartData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData("http://localhost:5000/water/getdailydata");
  }, []);

  const onClickTimeRange = async (timeRange) => {
    const url =
      timeRange === "daily"
        ? "http://localhost:5000/water/getdailydata"
        : timeRange === "weekly"
        ? "http://localhost:5000/water/getweeklydata"
        : "http://localhost:5000/water/getmonthlydata";
    fetchData(url);
  };

  // const renderData = async (data) => {
  //   // Set the data to state
  //   setChartData(data);

  //   // Render the charts
  //   renderChartStage1_concentrate_flow(data);
  //   renderChartStage2_concentrate_factor(data);
  //   renderChartStage1_feed_TDS(data);
  //   renderChartTCF(data);
  //   renderChartPermeate_TDS(data);
  //   renderChartStage1_pressure_drop(data);
  //   renderChartStage1_average_flow(data);
  //   renderChartStage2_pressure_drop(data);
  //   renderChartStage2_average_flow(data);
  //   renderChartStage1_concentrate_factor(data);
  //   renderChartSalt_rejection(data);
  //   renderChartStage1_normalized_pressure_drop(data);
  //   renderChartStage2_normalized_pressure_drop(data);
  //   renderChartStage1_concentrate_TDS(data);
  //   renderChartSalt_passage(data);
  //   renderChartStage1_aNDP(data);
  //   renderChartStage2_aNDP(data);
  //   renderChartNormalized_salt_rejection(data);
  //   renderChartStage1_baseline_net_permeate_flow(data);
  //   renderChartStage2_baseline_net_permeate_flow(data);
  // };

  // }, []);

  // const renderChartStage1_concentrate_flow = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage1 concentrate flow",
  //       data: data.map((record) => record.average.Stage1_concentrate_flow_m3h),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "m³h",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage1_concentrate_flow = new ApexCharts(
  //     document.querySelector("#Stage1_concentrate_flow_m3h"),
  //     options
  //   );
  //   Chart_Stage1_concentrate_flow.render();
  // };
  // const renderChartStage2_concentrate_factor = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage2 concentrate factor",
  //       data: data.map((record) => record.average.Stage2_concentrate_factor),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "m³h",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage2_concentrate_factor = new ApexCharts(
  //     document.querySelector("#Stage2_concentrate_factor"),
  //     options
  //   );
  //   Chart_Stage2_concentrate_factor.render();
  // };
  // const renderChartStage1_feed_TDS = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage1 feed TDS",
  //       data: data.map((record) => record.average.Stage1_feed_TDS_mgl),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "mg/l",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage1_feed_TDS = new ApexCharts(
  //     document.querySelector("#Stage1_feed_TDS"),
  //     options
  //   );
  //   Chart_Stage1_feed_TDS.render();
  // };
  // const renderChartTCF = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "TCF",
  //       data: data.map((record) => record.average.TCF),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "m³h",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_TCF = new ApexCharts(document.querySelector("#TCF"), options);
  //   Chart_TCF.render();
  // };
  // const renderChartPermeate_TDS = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Permeate_TDS mgl",
  //       data: data.map((record) => record.average.Permeate_TDS_mgl),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "mg/l",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Permeate_TDS_mgl = new ApexCharts(
  //     document.querySelector("#Permeate_TDS_mgl"),
  //     options
  //   );
  //   Chart_Permeate_TDS_mgl.render();
  // };
  // const renderChartStage1_pressure_drop = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage1 pressure drop (bar)",
  //       data: data.map((record) => record.average.Stage1_pressure_drop_bar),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "mg/l",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage1_pressure_drop_bar = new ApexCharts(
  //     document.querySelector("#Stage1_pressure_drop_bar"),
  //     options
  //   );
  //   Chart_Stage1_pressure_drop_bar.render();
  // };
  // const renderChartStage1_average_flow = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage1 average flow (m³h)",
  //       data: data.map((record) => record.average.Stage1_average_flow_m3h),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "m³h",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage1_average_flow_m3h = new ApexCharts(
  //     document.querySelector("#Stage1_average_flow_m3h"),
  //     options
  //   );
  //   Chart_Stage1_average_flow_m3h.render();
  // };
  // const renderChartStage2_pressure_drop = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage2 pressure drop (bar)",
  //       data: data.map((record) => record.average.Stage2_pressure_drop_bar),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "bar",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage2_pressure_drop_bar = new ApexCharts(
  //     document.querySelector("#Stage2_pressure_drop_bar"),
  //     options
  //   );
  //   Chart_Stage2_pressure_drop_bar.render();
  // };
  // const renderChartStage2_average_flow = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage2 average flow (m³h)",
  //       data: data.map((record) => record.average.Stage2_average_flow_m3h),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "m³h",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage2_average_flow_m3h = new ApexCharts(
  //     document.querySelector("#Stage2_average_flow_m3h"),
  //     options
  //   );
  //   Chart_Stage2_average_flow_m3h.render();
  // };
  // const renderChartStage1_concentrate_factor = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage1_concentrate_factor",
  //       data: data.map((record) => record.average.Stage1_concentrate_factor),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "m³h",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage1_concentrate_factor = new ApexCharts(
  //     document.querySelector("#Stage1_concentrate_factor"),
  //     options
  //   );
  //   Chart_Stage1_concentrate_factor.render();
  // };
  // const renderChartSalt_rejection = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Salt rejection",
  //       data: data.map((record) => record.average.Salt_rejection),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "m³h",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Salt_rejection = new ApexCharts(
  //     document.querySelector("#Salt_rejection"),
  //     options
  //   );
  //   Chart_Salt_rejection.render();
  // };
  // const renderChartStage1_normalized_pressure_drop = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage1 normalized pressure drop",
  //       data: data.map(
  //         (record) => record.average.Stage1_normalized_pressure_drop_bar
  //       ),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "m³h",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage1_normalized_pressure_drop = new ApexCharts(
  //     document.querySelector("#Stage1_normalized_pressure_drop_bar"),
  //     options
  //   );
  //   Chart_Stage1_normalized_pressure_drop.render();
  // };
  // const renderChartStage2_normalized_pressure_drop = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage2 normalized pressure drop",
  //       data: data.map(
  //         (record) => record.average.Stage2_normalized_pressure_drop_bar
  //       ),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "m³h",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage2_normalized_pressure_drop_bar = new ApexCharts(
  //     document.querySelector("#Stage2_normalized_pressure_drop_bar"),
  //     options
  //   );
  //   Chart_Stage2_normalized_pressure_drop_bar.render();
  // };
  // const renderChartStage1_concentrate_TDS = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage1 concentrate TDS ",
  //       data: data.map((record) => record.average.Stage1_concentrate_TDS_mgl),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "mg/l",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage1_concentrate_TDS_mgl = new ApexCharts(
  //     document.querySelector("#Stage1_concentrate_TDS_mgl"),
  //     options
  //   );
  //   Chart_Stage1_concentrate_TDS_mgl.render();
  // };
  // const renderChartSalt_passage = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Salt passage ",
  //       data: data.map((record) => record.average.Salt_passage),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "mg/l",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Salt_passage = new ApexCharts(
  //     document.querySelector("#Salt_passage"),
  //     options
  //   );
  //   Chart_Salt_passage.render();
  // };
  // const renderChartStage1_aNDP = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage1 aNDP ",
  //       data: data.map((record) => record.average.Stage1_aNDP),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "mg/l",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage1_aNDP = new ApexCharts(
  //     document.querySelector("#Stage1_aNDP"),
  //     options
  //   );
  //   Chart_Stage1_aNDP.render();
  // };
  // const renderChartStage2_aNDP = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage2 aNDP ",
  //       data: data.map((record) => record.average.Stage2_aNDP),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "mg/l",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage2_aNDP = new ApexCharts(
  //     document.querySelector("#Stage2_aNDP"),
  //     options
  //   );
  //   Chart_Stage2_aNDP.render();
  // };
  // const renderChartNormalized_salt_rejection = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Normalized_salt_rejection",
  //       data: data.map((record) => record.average.Normalized_salt_rejection),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "mg/l",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Normalized_salt_rejection = new ApexCharts(
  //     document.querySelector("#Normalized_salt_rejection"),
  //     options
  //   );
  //   Chart_Normalized_salt_rejection.render();
  // };
  // const renderChartStage1_baseline_net_permeate_flow = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage1 baseline net permeate flow",
  //       data: data.map(
  //         (record) => record.average.Stage1_baseline_net_permeate_flow
  //       ),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "mg/l",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage1_baseline_net_permeate_flow = new ApexCharts(
  //     document.querySelector("#Stage1_baseline_net_permeate_flow"),
  //     options
  //   );
  //   Chart_Stage1_baseline_net_permeate_flow.render();
  // };
  // const renderChartStage2_baseline_net_permeate_flow = (data) => {
  //   // Prepare the chart series
  //   const series = [
  //     {
  //       name: "Stage2 baseline net permeate flow",
  //       data: data.map(
  //         (record) => record.average.Stage2_baseline_net_permeate_flow
  //       ),
  //     },
  //   ];

  //   // Configure ApexCharts options
  //   const options = {
  //     chart: {
  //       type: "area",
  //       height: 350,
  //     },
  //     title: {
  //       text: "mg/l",
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     series: series,
  //     xaxis: {
  //       categories: data.map((record) => record.date),
  //     },
  //   };

  //   // Render the chart using ApexCharts
  //   const Chart_Stage2_baseline_net_permeate_flow = new ApexCharts(
  //     document.querySelector("#Stage2_baseline_net_permeate_flow"),
  //     options
  //   );
  //   Chart_Stage2_baseline_net_permeate_flow.render();
  // };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div>
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
          <div className={styles.grid}>
            {chartData.map((chart) => (
              <Card key={chart.chartId}>
                <LineChart
                  key={chart.chartId}
                  chartId={chart.chartId}
                  series={chart.series}
                  title={chart.title}
                  xCategories={chart.xCategories}
                />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
