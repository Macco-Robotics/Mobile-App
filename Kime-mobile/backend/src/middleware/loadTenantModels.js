import { getTenantModels } from "../db/dynamicConn.js";

export const loadTenantModels = async (req, res, next) => {
    try {
        const dbName = req.restaurantSlug;
        req.models = await getTenantModels(dbName);
        next();
    } catch (error) {
        next(error);
    }
}