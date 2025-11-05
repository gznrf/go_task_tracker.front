import axios from "axios";
import { defaultRoute } from '../../routes/routes.js';



const BaseRequest = axios.create({
    baseURL: defaultRoute,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default BaseRequest;
