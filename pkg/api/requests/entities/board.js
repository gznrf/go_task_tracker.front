import BaseRequest from "./base.js";
import {entitiesRoutes} from "../../routes/routes.js";

export const BoardRequests = {
    create: (data) => BaseRequest.post(entitiesRoutes.boardRoutes.Create, data),
    get: (data) => BaseRequest.get(entitiesRoutes.boardRoutes.Get, data),
    getByProjectId: (data) => BaseRequest.get(entitiesRoutes.boardRoutes.GetByProjectId, data),
    getById: (data) => BaseRequest.get(entitiesRoutes.boardRoutes.GetById, data),
    update: (data) => BaseRequest.patch(entitiesRoutes.boardRoutes.Update, data),
    delete: (data) => BaseRequest.delete(entitiesRoutes.boardRoutes.Delete, data),
};