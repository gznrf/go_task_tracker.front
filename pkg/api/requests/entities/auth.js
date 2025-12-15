import BaseRequest from "./base.js";
import {entitiesRoutes} from "../../routes/routes.js";

export const AuthRequests = {
    register: (data) => BaseRequest.post(entitiesRoutes.authRoutes.SignUp, data),
    login: (data) => BaseRequest.post(entitiesRoutes.authRoutes.SignIn, data),
    logout: (data) => BaseRequest.post(entitiesRoutes.authRoutes.Logout, data),
};
