import axios, { AxiosInstance } from "axios";
import { clean } from "../utils";
import { store } from "../redux/store";
import { logout } from "../redux/reducer";

const TIMEOUT = 15 * 1000; //15sec
// Replace with the server URL accordingly : your ip:3000 is frontend, your ip:8000 is backend
const SERVER_URL =
  process.env.REACT_APP_API_HOST || "http://172.20.103.189:8000";

const instance: AxiosInstance = axios.create({
  baseURL: SERVER_URL + "/api/",
  headers: {
    "Content-Type": "application/json",
  },
  params: clean({
    t: new Date().getTime(),
  }),
  timeout: TIMEOUT,
});
instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token && config?.headers) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    console.log("err response in intercept resp", err?.response?.data);
    const data = err?.response?.data;

    const originalConfig = err?.config;
    if (originalConfig?.url === "/api/user/login/" && err.response) {
      //todo --> refresh the refresh token
      console.log("refresh token expired");
      return Promise.reject(err);
    }

    if (
      err?.response?.status == 401 && (originalConfig?.url.includes("/current/") || originalConfig?.url.includes("categories/all"))
    ) {
      store.dispatch(logout());
      window.location.reload()
    }

    return Promise.reject(err);
  }
);
export const filePath = (ourl: any) => {
  const url = ourl;
  if (url) {
    if (url.includes("https") || url.includes("http")) {
      return url;
    } else {
      return SERVER_URL + url;
    }
  }
  return "";
};
function RemoveBaseUrl(url:string) {
/*
 * Replace base URL in given string, if it exists, and return the result.
 *
 * e.g. "http://localhost:8000/api/v1/blah/" becomes "/api/v1/blah/"
 *      "/api/v1/blah/" stays "/api/v1/blah/"
 */
var baseUrlPattern = /^http?:\/\/[a-z\:0-9.]+/;
var result = "";

var match = baseUrlPattern.exec(url);
if (match != null) {
    result = match[0];
}

if (result.length > 0) {
    url = url.replace(result, "");
}

return url;
}
export const filePath2 = (ourl: any) => {
  const url = ourl;
  if (url) {
    if (url.includes("https") || url.includes("http")) {
      return SERVER_URL+'/api/api/stream/?path='+RemoveBaseUrl(url);
    } else {
      return SERVER_URL+'/api/api/stream/?path='+url;
    }
  }
  return "";
};
export default instance;
