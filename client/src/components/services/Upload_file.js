import React, { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@mui/material";
// import { Spinner } from "../ui/Spinner";
import LoadingBar from "react-top-loading-bar";

const Upload_file = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const loadingBarRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
      <LoadingBar color="#f11946" ref={loadingBarRef} />

      <Button variant="contained" component="label">
        Select File
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      <Button onClick={handleUpload}>Upload</Button>
      {/* {loading && <Spinner />} */}
      {error && <div>{error}</div>}
    </div>
  );
};

export default Upload_file;
