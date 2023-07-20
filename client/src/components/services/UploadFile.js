import React, { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import styles from "./UploadFile.module.css";
import LoadingBar from "react-top-loading-bar";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadedData, setUploadedData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const loadingBarRef = useRef(null);

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
        .post("http://localhost:5000/water/upload", formData, {
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
        })
        .catch((error) => {
          console.error(error);
          setError("An error occurred during upload.");
          setLoading(false);
          loadingBarRef.current.complete(); // Complete the loading bar
        })
        .finally(() => {
          setLoading(false);
          setSelectedFile(null);
          setSelectedFileName("");
        });
    } else {
      setError("Please select a file.");
    }
  };

  return (
    <div>
      <LoadingBar color={"black"} height={"4px"} ref={loadingBarRef} />
      <div className="">
        <h2>
          Upload File:{" "}
          <a className={styles.selectedFileName}>{selectedFileName}</a>
        </h2>
      </div>
      <div className={styles.buttons}>
        <Button
          className={styles.button}
          variant="contained"
          component="label"
          sx={{ backgroundColor: "#2d363c", color: "#fff" }}
        >
          Select File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <label> </label>
        <Button
          className={styles.button}
          onClick={handleUpload}
          variant="contained"
          sx={{ backgroundColor: "#2d363c", color: "#fff" }}
        >
          Submit
        </Button>
      </div>
      {error && <div>{error}</div>}
    </div>
  );
};

export default UploadFile;
