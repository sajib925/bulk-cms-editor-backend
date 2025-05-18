import { webflowController } from "@/controllers/webflow";
import express from "express";
import { WebflowClient } from "webflow-api";
import { OauthScope } from "webflow-api/api/types/OAuthScope";

const webflowRouter = express.Router();

webflowRouter.get("/install", (req, res) => {
 
  const { state } = req.query;

    const authorizeUrl = WebflowClient.authorizeURL({
      scope: process.env.WEBFLOW_SCOPES?.split(',') as OauthScope[],
      clientId: process.env.WEBFLOW_CLIENT_ID!,
      state: state as string,
    });

    if (state) res.redirect(`${authorizeUrl}&state=${state}`);
    else res.redirect(authorizeUrl);


});

webflowRouter.get("/callback", webflowController.handleAuthorizationCallback);

webflowRouter.get("/custom_code", webflowController.getListOfCustomCodes);



export default webflowRouter;
