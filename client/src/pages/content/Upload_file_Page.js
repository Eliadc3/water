import React, { useState } from "react";
import axios from "axios";

const Upload_file_Page = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

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
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {error && <div>{error}</div>}
    </div>
  );
};

export default Upload_file_Page;
