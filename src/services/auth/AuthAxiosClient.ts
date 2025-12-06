
import axios, { AxiosInstance } from "axios";
import { BASE_AUTH_SERVICE_URL } from "../constants";


var defaultOptions = {
    baseURL: BASE_AUTH_SERVICE_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

class AxiosAuthClient {

  private static instance:AxiosInstance;

  public static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create(defaultOptions)
    }
    return this.instance;
    
  }

};

export default AxiosAuthClient;