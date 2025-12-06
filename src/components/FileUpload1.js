import { useState } from "react";

const MAX_COUNT = 5;

export const FileUpload1 = () => {
  const UPLOAD_FILE = `
 mutation ($files: [Upload!]!) {
  fileUpload(files: $files) {
    result {
      __typename
      ... on FileUploadMutationSuccess {
        code
        message
        result
      }
      ... on FileUploadMutationError {
        code
        message
      }
    }
  }
}`;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);

  const handleUploadFiles = (files) => {
    const uploaded = [...uploadedFiles];
    let limitExceeded = false;
    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setUploadedFiles(uploaded);
  };

  function handleSubmit(event) {
    event.preventDefault();

    if (uploadedFiles) {
      const len = uploadedFiles.length;

      const files = Array(len).fill(null);
      const formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: UPLOAD_FILE,
          variables: { files: files },
        })
      );

      let myDict = {};

      for (let i = 0; i < len; i++) {
        const data = "variables.files.".concat(i);
        myDict[i] = [data];
      }

      formData.append("map", JSON.stringify(myDict));
      for (let j = 0; j < len; j++) {
        formData.append(j, uploadedFiles[j]);
      }

      const requestOptions = {
        method: "POST",
        body: formData,
      };

      fetch("http://localhost:8000/graphql", requestOptions)
        .then((response) => {
          //const data = JSON.parse(JSON.stringify(response.json()));
          //response.json();
        })
        .then((data) => {
          console.log(data);
        });
    }
  }

  const handleFileEvent = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          id="fileUpload"
          type="file"
          multiple
          accept="application/pdf, image/png"
          onChange={handleFileEvent}
          disabled={fileLimit}
        />

        <label htmlFor="fileUpload">
          <a className={`btn btn-primary ${!fileLimit ? "" : "disabled"} `}>
            Upload Files
          </a>
        </label>

        <div className="uploaded-files-list">
          {uploadedFiles.map((file) => (
            <div key={file.name}>{file.name}</div>
          ))}
        </div>

        <button type="submit" onSubmit={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};
