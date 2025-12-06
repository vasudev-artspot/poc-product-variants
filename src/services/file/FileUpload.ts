import axios from "axios";
import { CONTENT_SERVICE_URL } from "../constants"; // Make sure this ends with /graphql

/**
 * Uploads files using GraphQL multipart request spec.
 * @param files Array of File objects to upload
 * @returns Upload response from the server
 */

const CONTENT_TYPE_ENUM: Record<string, number> = {
  THING: 0,
  SHOP: 1,
  ARTICLE: 2,
  // add more as defined in your backend schema
};

export const uploadFiles = async (
  files: File[],
  metadata: { contentType: string; mediaSubType: string }
) => {
  const formData = new FormData();

  const operations = JSON.stringify({
    query: `
      mutation uploadFiles($files: [Upload!]!, $filesMetadata: [FileMetadata]!) {
        fileUpload(files: $files, filesMetadata: $filesMetadata) {
          result {
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
      }
    `,
    variables: {
      files: files.map(() => null),
      filesMetadata: files.map(() => ({
        contentType: CONTENT_TYPE_ENUM[metadata?.contentType || "THING"],
        mediaSubType: "CARD",
      })),
    },
  });

  const map: Record<string, string[]> = {};
  files.forEach((_, index) => {
    map[index] = [`variables.files.${index}`];
  });

  formData.append("operations", operations);
  formData.append("map", JSON.stringify(map));
  files.forEach((file, index) => {
    formData.append(index.toString(), file);
  });

  const token = localStorage.getItem("token");

  const response = await axios.post(`${CONTENT_SERVICE_URL}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return response.data.data.fileUpload.result;
};

/**
 * Deletes a file from the server by identifier.
 * @param fileIdentifier ID or name of file to delete
 * @returns Server response
 */
export const deleteFile = async (fileIdentifier: string) => {
  const query = `
    mutation deleteFile($fileInput: DeleteFileInput) {
      deleteFile(fileInput: $fileInput) {
        fileDeleteResult {
          ... on DeleteFileMutationSuccess {
            code
            success
          }
          ... on DeleteFileMutationError {
            code
          }
        }
      }
    }
  `;

  const variables = { fileInput: { fileIdentifier } };
  const token = localStorage.getItem("token");

  const response = await axios.post(`${CONTENT_SERVICE_URL}`, {
    query,
    variables,
  }, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return response.data.data.deleteFile.fileDeleteResult;
};
