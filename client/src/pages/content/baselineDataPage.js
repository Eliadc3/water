import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/Dashboard_Page.module.css";
import notifStyles from "../css/Notifications.module.css";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// BaselineData component provides a page for managing baseline data,
// allowing admin users to edit and save the data and displaying relevant notifications for feedback.
const BaselineData = () => {
  // State variables to hold baseline data and input values for each parameter.
  const [baselineData, setBaselineData] = useState([]);
  const [CIT_01, setCIT_01] = useState("");
  const [FIT_01, setFIT_01] = useState("");
  const [FIT_02, setFIT_02] = useState("");
  const [FIT_03, setFIT_03] = useState("");
  const [PIT_03, setPIT_03] = useState("");
  const [PIT_04, setPIT_04] = useState("");
  const [PIT_05, setPIT_05] = useState("");
  const [PIT_06, setPIT_06] = useState("");
  const [PIT_07, setPIT_07] = useState("");
  const [TIT_01, setTIT_01] = useState("");
  const [CIT_02, setCIT_02] = useState("");

  // State variable to show notifications (success/failure).
  const [notification, setNotification] = useState(null);
  // Create a navigate function to redirect to other pages.
  const navigate = useNavigate();

  // Function to check if the user is authenticated as an admin.
  const checkAuthentication = () => {
    const token = Cookies.get("token");
    const admin = Cookies.get("admin");

    if (!token || admin !== "true") {
      navigate("/login");
    }
  };

  // On component mount, check authentication and fetch baseline data.
  useEffect(() => {
    const fetchDataAndCheckAuthentication = async () => {
      await checkAuthentication();
      fetchData();
    };

    fetchDataAndCheckAuthentication();
  }, []);

  // Set up a timer for notification dismissal.
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Function to handle the data submission.
  const handleDataSubmit = async () => {
    try {
      // Create a formData object with all the parameter values.
      const formData = {
        CIT_01,
        FIT_01,
        FIT_02,
        FIT_03,
        PIT_03,
        PIT_04,
        PIT_05,
        PIT_06,
        PIT_07,
        TIT_01,
        CIT_02,
      };

      // Make a POST request to save the data.
      const response = await axios.post(
        "http://localhost:5000/water/baseline/manipulations",
        formData
      );

      // Set a success notification.
      setNotification("Data saved successfully.");

      console.log(response.data.message);
    } catch (error) {
      console.error("Error saving data: ", error);
      // Set an error notification.
      setNotification("Error saving data. Please try again.");
    }
  };

  // Function to fetch baseline data.
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/water/baseline/input-data"
      );
      const updatedBaselineData = response.data[0];
      setBaselineData(updatedBaselineData);

      // Set the state for each parameter with the fetched data.
      setCIT_01(updatedBaselineData.CIT_01);
      setFIT_01(updatedBaselineData.FIT_01);
      setFIT_02(updatedBaselineData.FIT_02);
      setFIT_03(updatedBaselineData.FIT_03);
      setPIT_03(updatedBaselineData.PIT_03);
      setPIT_04(updatedBaselineData.PIT_04);
      setPIT_05(updatedBaselineData.PIT_05);
      setPIT_06(updatedBaselineData.PIT_06);
      setPIT_07(updatedBaselineData.PIT_07);
      setTIT_01(updatedBaselineData.TIT_01);
      setCIT_02(updatedBaselineData.CIT_02);
      console.log(updatedBaselineData);
    } catch (error) {
      console.error("Error fetching baseline data: ", error);
    }
  };

  return (
    <div>
      {/* Render the page header */}
      <div className={styles.pageName}>
        <h2>Baseline</h2>
      </div>
      {/* Render the "Save" button for data submission */}
      <button className={styles.btn} onClick={handleDataSubmit}>
        Save
      </button>
      {/* Render the notification if available */}
      {notification && (
        <div className={notifStyles.notificationContainer}>
          <div className={notifStyles.notificationBox}>
            {/* Render different styles for success and error notifications */}
            {notification === "Data saved successfully." ? (
              <div
                className={`${notifStyles.notification} ${
                  notification.fadeOut ? notifStyles.fadeOut : ""
                }`}
              >
                {notification}
              </div>
            ) : (
              <div
                className={`${notifStyles.badnotification} ${
                  notification.fadeOut ? notifStyles.fadeOut : ""
                }`}
              >
                {notification}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Render the table with input fields for editing baseline data */}
      <div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <h2>Parameter</h2>
                </TableCell>
                <TableCell>
                  <h2>Input Tag Name</h2>
                </TableCell>
                <TableCell>
                  <h2>Value</h2>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Render rows for each parameter with input fields */}
              <TableRow>
                <TableCell>Stage 1 - Feed conductivity</TableCell>
                <TableCell>CIT_01</TableCell>
                <TableCell
                  style={{
                    color: "#FFFFFF",
                  }}
                >
                  {/* Render the input field for each parameter */}
                  <TextField
                    type="text"
                    value={CIT_01}
                    onChange={(event) => setCIT_01(event.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow sx={{ height: "2rem" }}>
                <TableCell>Stage 1 - Permeat flow</TableCell>
                <TableCell>FIT_01</TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={FIT_01}
                    onChange={(event) => setFIT_01(event.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stage 2 - Permeat flow</TableCell>
                <TableCell>FIT_02</TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={FIT_02}
                    onChange={(event) => setFIT_02(event.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Concentrate flow</TableCell>
                <TableCell>FIT_03</TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={FIT_03}
                    onChange={(event) => setFIT_03(event.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stage 1 - feed pressure</TableCell>
                <TableCell>PIT_03</TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={PIT_03}
                    onChange={(event) => setPIT_03(event.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stage 1 - concentrate pressure</TableCell>
                <TableCell>PIT_04</TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={PIT_04}
                    onChange={(event) => setPIT_04(event.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stage 2 - feed pressure</TableCell>
                <TableCell>PIT_05</TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={PIT_05}
                    onChange={(event) => setPIT_05(event.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stage 2 - concentrate pressure</TableCell>
                <TableCell>PIT_06</TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={PIT_06}
                    onChange={(event) => setPIT_06(event.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Permeate pressure</TableCell>
                <TableCell>PIT_07</TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={PIT_07}
                    onChange={(event) => setPIT_07(event.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Feed water temperature</TableCell>
                <TableCell>TIT_01</TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={TIT_01}
                    onChange={(event) => setTIT_01(event.target.value)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
export default BaselineData;
