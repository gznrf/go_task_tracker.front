import BaseRequest from "./base.js";
import {entitiesRoutes} from "../../routes/routes.js";

export const ProjectRequests = {
    create: (data) => BaseRequest.post(entitiesRoutes.projectRoutes.Create, data),
    get: (data) => BaseRequest.get(entitiesRoutes.projectRoutes.Get, data),
    getByUserId: (data) => BaseRequest.get(entitiesRoutes.projectRoutes.GetByUserId, data),
    getById: (data) => BaseRequest.get(entitiesRoutes.projectRoutes.GetById, data),
    update: (data) => BaseRequest.patch(entitiesRoutes.projectRoutes.Update, data),
    delete: (data) => BaseRequest.delete(entitiesRoutes.projectRoutes.Delete, data),
};