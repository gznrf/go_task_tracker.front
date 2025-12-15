import BaseRequest from "./base.js";
import {entitiesRoutes} from "../../routes/routes.js";

export const AuthRequests = {
    register: (data) => BaseRequest.post(entitiesRoutes.authRoutes.SignUp, JSON.stringify(data)),
    login: (data) => BaseRequest.post(entitiesRoutes.authRoutes.SignIn, JSON.stringify(data)),
    logout: (data) => BaseRequest.post(entitiesRoutes.authRoutes.Logout, JSON.stringify(data)),
};
