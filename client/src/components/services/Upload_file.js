import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import styles from "./Upload_file.module.css";
import LoadingBar from "react-top-loading-bar";
import { ThemeContext } from "../themes/ThemeContext";

const Upload_file = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadedData, setUploadedData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const loadingBarRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setSelectedFileName(file ? file.name : "");
  };

  const handleUpload = () => {
    if (selectedFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      loadingBarRef.current.continuousStart(); // Start the loading bar
      axios
        .post("http://localhost:5000/water/manipulations", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data);
          setUploadedData(response.data); // Set the uploaded data in state
          // Handle successful upload
          loadingBarRef.current.complete(); // Complete the loading bar
          window.location.reload();
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setError("An error occurred during upload.");
          setLoading(false);
          loadingBarRef.current.complete(); // Complete the loading bar
        });
    } else {
      setError("Please select a file.");
    }
  };

  return (
    <div>
      <LoadingBar
        color={theme === "dark" ? "#ffffff" : "#000000"}
        height={"4px"}
        ref={loadingBarRef}
      />
      <Button variant="contained" component="label">
        Select File
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      <Button onClick={handleUpload} variant="contained">
        Upload
      </Button>
      <div className={styles.selectedFileName}>{selectedFileName}</div>{" "}
      {error && <div>{error}</div>}
    </div>
  );
};

export default Upload_file;
