import connect from "@/utils/connection.ts";
import { defineMiddleware } from "astro:middleware";

// import User from "@/models/user.ts";

export const onRequest = defineMiddleware(async (context, next) => {
    connect();
    return next();
});
