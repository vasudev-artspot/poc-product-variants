import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Routing from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { AlertProvider } from "./utils/AlertBar";
// import client from "./services/ApolloClient";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <AlertProvider>
        <AuthProvider>
          <Routing />
        </AuthProvider>
      </AlertProvider>
    </QueryClientProvider>
  );
}

export default App;
