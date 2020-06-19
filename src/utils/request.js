import axios from "axios";
import { Message } from "element-ui";

// create an axios instance
const service = axios.create({
    baseURL: "/", // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent

        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        config.headers["content-type"] = "application/x-www-form-urlencoded";
        return config;
    },
    error => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data;
        if (res.code) {
            // if the custom code is not 20000, it is judged as an error.
            if (res.code !== 1) {
                Message({
                    message: res.message || "接口错误",
                    type: "error",
                    duration: 5 * 1000
                });

                return Promise.reject(new Error(res.message || "Error"));
            } else {
                return res;
            }
        } else {
            return res;
        }
    },
    error => {
        console.log("err" + error); // for debug
        Message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

export default service;
