import BaseRequest from "./base.js";
import {entitiesRoutes} from "../../routes/routes.js";

export const UserRequests = {
    get: (data) => BaseRequest.get(entitiesRoutes.userRoutes.Get, data),
    getById: (data) => BaseRequest.get(entitiesRoutes.userRoutes.GetById, data),
    update: (data) => BaseRequest.patch(entitiesRoutes.userRoutes.Update, data),
    delete: (data) => BaseRequest.delete(entitiesRoutes.userRoutes.Delete, data),
};