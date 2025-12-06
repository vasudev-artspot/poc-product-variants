import React from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';


const cache = new InMemoryCache();
const uri = "http://0.0.0.0:8000/graphql";
const link = createUploadLink({ uri });
const client = new ApolloClient({ cache, link });
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={'/content'}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
