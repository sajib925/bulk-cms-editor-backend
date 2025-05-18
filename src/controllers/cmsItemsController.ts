import {Request, RequestHandler, Response} from "express";
import siteService from "@/repository/site";
import WebflowApiClient from "@/webflow/apiClient";


const getCollectionItemsList:RequestHandler = async(req:Request , res:Response):Promise<void> =>{

    try{
        const {siteId} = req.query
        const {collection_id} = req.params

        const site = await siteService.getSiteByWebflowId(siteId as string);
        if (!site) {
            res.status(400).json({message: "Collection isn't found!"});
        }

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        const collectionItems = await webflowApiClient.getCollectionItems(collection_id)

        console.log("from controller Details", collectionItems)

        res.send({message:siteId, collectionItems})

    } catch (err) {

        res.send({message: "500 Internal Server Error"})

    }

}

const getCollectionItem:RequestHandler = async(req:Request , res:Response):Promise<void> =>{

    try{
        const {siteId} = req.query
        const {collection_id, item_id} = req.params

        const site = await siteService.getSiteByWebflowId(siteId as string);
        if (!site) {
            res.status(400).json({message: "Collection isn't found!"});
        }

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        const collectionItem = await webflowApiClient.getCollectionItem(collection_id, item_id)

        console.log("from controller Details", collectionItem)

        res.send({message:siteId, collectionItem})

    } catch (err) {

        res.send({message: "500 Internal Server Error"})

    }

}

const createCollectionItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { siteId } = req.query;
        const { collection_id } = req.params;
        const items = req.body.items;

        if (!Array.isArray(items) || items.length === 0) {
            res.status(400).json({ message: "No items provided for creation." });
            return;
        }

        const site = await siteService.getSiteByWebflowId(siteId as string);
        if (!site) {
            res.status(404).json({ message: "Site isn't found!" });
            return;
        }

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        const createdItems = await webflowApiClient.createCollectionItems(collection_id as string, items);

        res.status(201).json({ message: "Items created successfully!", createdItems });
    } catch (err) {
        console.error("Error creating collection items:", err);
        res.status(500).json({ message: "500 Internal Server Error" });
    }
};

const updateCollectionItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { siteId } = req.query;
        const { collection_id, item_id } = req.params;
        const fieldData = req.body; // 👈 dynamically capture everything

        const site = await siteService.getSiteByWebflowId(siteId as string);
        if (!site) {
            res.status(404).json({ message: "Site isn't found!" });
        }

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        if (!item_id) {
            res.status(400).json({ message: "Item update failed!" });
        }

        const collectionItem = await webflowApiClient.updateCollectionItem(collection_id, item_id, fieldData);

        res.json({ message: "Item updated successfully!", collectionItem });
    } catch (err) {
        console.error("Error updating collection item:", err);
        res.status(500).json({ message: "500 Internal Server Error" });
    }
};

const updateCollectionItems: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { siteId } = req.query;
        const { collection_id } = req.params;
        const items = req.body.items;

        if (!Array.isArray(items) || items.length === 0) {
            res.status(400).json({ message: "No items provided for update." });
            return;
        }


        const site = await siteService.getSiteByWebflowId(siteId as string);
        if (!site) {
            res.status(404).json({ message: "Site not found!" });
            return;
        }

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        const updatedItems = await webflowApiClient.updateCollectionItems(collection_id, items);

       res.json({ message: "Items updated successfully!", updatedItems });
    } catch (err) {
        console.error("Error updating collection items:", err);
        res.status(500).json({ message: "500 Internal Server Error" });
    }
};

const deleteCollectionItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { siteId } = req.query;
        const { collection_id, item_id } = req.params;

        const site = await siteService.getSiteByWebflowId(siteId as string);

        if (!site) {
            res.status(404).json({ message: "Site isn't found!" });
        }

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        if (!item_id) {
            res.status(404).json({ message: "Collection Item not found or already deleted!" });
        }

        const deletedCollection = await webflowApiClient.deleteCollectionItem(collection_id , item_id);

        res.json({ message: "Collection Item deleted successfully!", deletedCollection });



    } catch (err) {
        console.error("Error deleting collection Item:", err);
        res.status(500).json({ message: "500 Internal Server Error" });
    }
};

const publishCollectionItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { siteId } = req.query;
        const { collection_id } = req.params;
        const { itemIds } = req.body;

        const site = await siteService.getSiteByWebflowId(siteId as string);
        if (!site) {
            res.status(404).json({ message: "Site isn't found!" });
            return;
        }

        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            res.status(400).json({ message: "No itemIds provided." });
            return;
        }

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        const publishResult = await webflowApiClient.publishCollectionItem(collection_id, itemIds);

        res.json({
            message: "Collection items published successfully!",
            data: publishResult
        });

    } catch (err) {
        console.error("Error publishing collection items:", err);
        res.status(500).json({ message: "500 Internal Server Error" });
    }
};


const cmsItemsController = {
    getCollectionItemsList,
    getCollectionItem,
    createCollectionItem,
    updateCollectionItems,
    updateCollectionItem,
    deleteCollectionItem,
    publishCollectionItem
};
export default cmsItemsController;