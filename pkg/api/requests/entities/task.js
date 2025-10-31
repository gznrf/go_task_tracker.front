import BaseRequest from "./base.js";
import {entitiesRoutes} from "../../routes/routes.js";

export const TaskRequests = {
    create: (data) => BaseRequest.post(entitiesRoutes.taskRoutes.Create, data),
    get: (data) => BaseRequest.get(entitiesRoutes.taskRoutes.Get, data),
    getByColumnId: (data) => BaseRequest.get(entitiesRoutes.taskRoutes.GetByColumnId, data),
    getById: (data) => BaseRequest.get(entitiesRoutes.taskRoutes.GetById, data),
    update: (data) => BaseRequest.patch(entitiesRoutes.taskRoutes.Update, data),
    delete: (data) => BaseRequest.delete(entitiesRoutes.taskRoutes.Delete, data),
};
