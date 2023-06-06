import React, { useState } from "react";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import styles from "../../pages/content/Dashboard_Page.module.css";

const Upload_file = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [uploading, setUploading] = useState(false); // For the button
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    setUploading(true);
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
      })
      .catch((error) => {
        console.error(error);
        setError("An error occurred during upload.");
      })
      .finally(() => {
        setUploading(false); // Set uploading state to false
        alert("Data uploaded successful.");
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <LoadingButton
        loading={uploading}
        onClick={handleUpload}
        variant="contained"
        color="primary"
        className={styles.button_transition}
      >
        Upload
      </LoadingButton>

      {error && <div>{error}</div>}
    </div>
  );
};

export default Upload_file;
