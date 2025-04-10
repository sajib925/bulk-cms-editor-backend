import { WebflowAuthenticatedUser } from "@/lib/type/type";
import siteService from "@/repository/site";
import userRepository from "@/repository/user";
import webflowDataSerializer from "@/serializer/webflowDataSerializer";
import WebflowApiClient from "@/webflow/apiClient";
import webflowAuthClient from "@/webflow/auth";
import { Request, RequestHandler, Response } from "express"
import {WebflowClient} from "webflow-api"
import { Site } from "webflow-api/api";


const WEBFLOW_USER_DASHBOARD_URL = "https://webflow.com/dashboard";

const saveAllSitesWithUser = async (accessToken:string) =>{
    const webflowApiClient = new WebflowClient({accessToken});
    const webflowUser = await webflowApiClient.token.authorizedBy()

    const sites = (await webflowApiClient.sites.list()).sites as Site[] 

    const serializedSite = webflowDataSerializer.serializedWebflowSitesListToDbSites(sites);
    const serializedUser = webflowDataSerializer.serializeWebflowAuthenticatedUserToDbUser(webflowUser as WebflowAuthenticatedUser , accessToken);

    await userRepository.upsertUserAndSites(serializedUser, serializedSite);
}



const handleAuthorizationCallback:RequestHandler = async (req:Request , res:Response):Promise<void>=>{

    try {
        const {code , state, error, error_description} = req.query

        if (error) {
            console.log("Error returned from webflow auth callback");
            console.log("Error code: ", error, "Error description: ", error_description);
            res.status(400).json({message: "You didn't authorize the app."});
        } 

        const accessToken = await webflowAuthClient.exchangeCodeForAccessToken(code as string)
       
        await saveAllSitesWithUser(accessToken)

        res.redirect(WEBFLOW_USER_DASHBOARD_URL)
        

    } catch (error) {
        console.log(error);
        console.log("Error handling webflow authorization callback: ", error);
        res.status(500).json({
            error:error,
            message: "Something went wrong!",
        });  
    }
}




const getSiteByWebflowId:RequestHandler = async (req: Request, res: Response):Promise<void> => {
    try {
        const {siteId} = req.query;
        const site = await siteService.getSiteByWebflowId(siteId as string);

        if (!site) res.status(404).json({message: "Site not found!"});

        delete site.user;
        res.status(200).json(site);
    } catch (err) {
        console.log("Error getting site by webflow id: ", req.query.siteId, err);
        res.status(500).json({
            error: err,
            message: "Something went wrong!"
        });
    }
};

const getListOfCustomCodes:RequestHandler = async(req:Request, res:Response)=>{
    try {
        const {siteId} = req.query

        const site = await siteService.getSiteByWebflowId(siteId as string)

        if (!site) res.status(400).json({message:"Site not found with this site id"})

        const webflowApiClient = new WebflowApiClient(site.user.accessToken as string)

        const scripts = webflowApiClient.getListOfCustomCodes(siteId as string)
                
        res.status(200).send({message:"Status Ok", scripts})


    } catch (error) {
        
    }
}



export const webflowController = {
    handleAuthorizationCallback,
    getSiteByWebflowId,
    getListOfCustomCodes
}