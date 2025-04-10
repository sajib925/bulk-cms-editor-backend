import express, { Router } from "express";
import webflowRouter from "@/api/webflow";
import cmsRouter from "@/api/cms";


type RoutePath = "/webflow" | "/cms";

const routeMap: Record<RoutePath, Router> = {
  "/webflow": webflowRouter,
  "/cms": cmsRouter,
};

const apiRouter = express.Router();
``
for (let routePath in routeMap) {
  apiRouter.use(routePath, routeMap[routePath]);
}

export default apiRouter;
