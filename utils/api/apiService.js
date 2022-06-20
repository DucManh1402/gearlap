import axios from "axios";
import Cookies from "js-cookie";

const apiService = axios.create({

    baseURL: "/api",

    headers: {
        Authorization: Cookies.get("glcookie") ? `Bearer ${Cookies.get("glcookie")}` : '',
    },
});

export default apiService;

