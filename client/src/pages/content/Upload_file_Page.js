import React, { useState } from "react";
import axios from "axios";
import Graph from "../../components/graph";

const Upload_file_Page = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);

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
        // Handle error
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadedData && <Graph data={uploadedData} />}
    </div>
  );
};

export default Upload_file_Page;
