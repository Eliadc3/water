import React, { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import styles from "./UploadFile.module.css";
import LoadingBar from "react-top-loading-bar";

// UploadFile component provides a file upload functionality with a loading bar
// to indicate progress and error handling.
const UploadFile = () => {
  // State variables to manage the component's behavior and data.
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadedData, setUploadedData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // useRef to get a reference to the LoadingBar component to control it.
  const loadingBarRef = useRef(null);

  // Event handler to handle file selection from the input file field.
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setSelectedFileName(file ? file.name : "");
  };

  // Event handler to handle the upload button click.
  const handleUpload = () => {
    if (selectedFile) {
      setLoading(true); // Set the loading state to true to show the loading bar.
      const formData = new FormData();
      formData.append("file", selectedFile); // Append the selected file to the FormData object.
      loadingBarRef.current.continuousStart(); // Start the loading bar animation.
      axios
        .post("http://localhost:5000/water/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data);
          setUploadedData(response.data); // Set the uploaded data in state.
          // Handle successful upload
          loadingBarRef.current.complete(); // Complete the loading bar
          window.location.reload(); // Reload the page after successful upload.
        })
        .catch((error) => {
          console.error(error);
          setError("An error occurred during upload.");
          setLoading(false); // Set loading state to false since the upload is complete.
          loadingBarRef.current.complete(); // Complete the loading bar.
        })
        .finally(() => {
          setLoading(false); // Set loading state to false to hide the loading bar.
          setSelectedFile(null); // Reset selected file state.
          setSelectedFileName(""); // Reset selected file name state.
        });
    } else {
      setError("Please select a file.");
    }
  };

  return (
    <div>
      {/* LoadingBar component to display a loading progress bar */}
      <LoadingBar color={"black"} height={"4px"} ref={loadingBarRef} />
      <div className="">
        {/* Display the selected file name */}
        <h2>
          Upload File:{" "}
          <a className={styles.selectedFileName}>{selectedFileName}</a>
        </h2>
      </div>
      <div className={styles.buttons}>
        {/* Button to open the file selection dialog */}
        <Button
          className={styles.button}
          variant="contained"
          component="label"
          sx={{
            backgroundColor: "#2d363c",
            color: "#fff",
          }}
        >
          Select File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <label> </label>
        {/* Button to initiate the file upload */}
        <Button
          className={styles.button}
          onClick={handleUpload}
          variant="contained"
          sx={{
            backgroundColor: "#2d363c",
            color: "#fff",
          }}
        >
          Submit
        </Button>
      </div>
      {/* Display any error message that occurred during the upload */}
      {error && <div>{error}</div>}
    </div>
  );
};

export default UploadFile;
