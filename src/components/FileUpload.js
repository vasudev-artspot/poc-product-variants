import React, { useState } from "react";
import FormData from "form-data";

export const FileUpload = () => {
  const UPLOAD_FILE = `
  mutation ($file: Upload!)
  {
    fileUpload(file: $file)
    {
      success
    }
  }`;

  function handleSubmit(event) {
    event.preventDefault();

    if (file) {
      var reader = new FileReader();
      var fileByteArray = [];
      reader.readAsArrayBuffer(file);
      reader.onloadend = function (evt) {
        if (evt.target.readyState === FileReader.DONE) {
          var arrayBuffer = evt.target.result,
            array = new Uint8Array(arrayBuffer);
          for (var i = 0; i < array.length; i++) {
            fileByteArray.push(array[i]);
          }
        }
      };

      const formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: UPLOAD_FILE,
          variables: { file: null },
        })
      );

      formData.append("map", JSON.stringify({ 0: ["variables.file"] }));
      //formData.append("name", JSON.stringify({ name: file.name }));
      formData.append(0, file);
      const requestOptions = {
        method: "POST",
        body: formData,
      };

      fetch("http://localhost:8000/graphql", requestOptions)
        .then((response) => {
          //response.json();
        })
        .then((data) => {
          console.log(data);
        });
    }
  }
  const [file, setFile] = useState(null);

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  return (
    <div>
      <h1>File upload example</h1>
      <p>Upload a file below</p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="fileUpload" type="file" onChange={handleChange} />
        <button type="submit" onSubmit={handleSubmit}>
          Submit
        </button>
      </form>
      <LoginSignup />
    </div>
  );
};
