import  axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { handleAuth } from '../src/Redux/userReducer';
import { useEffect, useRef } from 'react';
import axiosRetry from 'axios-retry'; 
export const host =  "https://app.saucedapp.com/sauced-backend/api"
// export const host =  "https://anton.markcoders.com/sauced-backend/api"
// export const host =  "http://localhost:6001/api"
// export const host =  "https://9hjl5qp6-6001.inc1.devtunnels.ms/api"




const useAxios = () => {
  const auth = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const token = auth.token;
  const cancelTokenSource = useRef(null);
  const axiosInstance = axios.create({
    // baseURL: host,
    baseURL:host,
    validateStatus: function (status) {
      return status >= 200 && status < 300; // default
    }
  });
  axiosRetry(axiosInstance, {
    retries: 4, // Maximum number of retries
    retryDelay: (retryCount) => {
      return retryCount * 1000; // Exponential backoff
    },
    shouldRetry: (error) => {
      // Retry on network errors or 5xx server errors
      return error.response && error.response.status >= 500;
    },
  });
  axiosInstance.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      cancelTokenSource.current = axios.CancelToken.source(); // Create a new cancel token before request
      config.cancelToken = cancelTokenSource.current.token;
      return config;
    },
    (error) => Promise.reject(error)
  );
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 480) {
        dispatch(
          handleAuth({
            "token": null,
            "uid": null,
            "name": null,
            "email": null,
            "provider": null,
            "type": null,
            "status": null,
            "_id": null,
            "url":null,
            "authenticated": false,
            "welcome":false,
          })
        );
        navigation.navigate("SignIn");
      }
      return Promise.reject(error);
    }
  );
  // return axiosInstance;


  useEffect(() => {
    return () => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel("Component unmounted, request canceled");
      }
    };
  }, []);

  return { ...axiosInstance };
};
export default useAxios;
