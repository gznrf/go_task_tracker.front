import BaseRequest from "./base.js";
import {entitiesRoutes} from "../../routes/routes.js";

export const ColumnRequest = {
    create: (data) => BaseRequest.post(entitiesRoutes.columnRoutes.Create, data),
    get: (data) => BaseRequest.get(entitiesRoutes.columnRoutes.Get, data),
    getByBoardId: (data) => BaseRequest.get(entitiesRoutes.columnRoutes.GetByBoardId, data),
    getById: (data) => BaseRequest.get(entitiesRoutes.columnRoutes.GetById, data),
    update: (data) => BaseRequest.patch(entitiesRoutes.columnRoutes.Create, data),
    delete: (data) => BaseRequest.delete(entitiesRoutes.columnRoutes.Create, data),
};