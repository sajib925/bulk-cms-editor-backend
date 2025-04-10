import siteService from "@/repository/site";
import { Request, RequestHandler, Response } from "express";
import WebflowApiClient from "@/webflow/apiClient";

const getCmsCollectionList:RequestHandler = async(req:Request , res:Response):Promise<void> =>{

    try{
        const {siteId} = req.query
        const site = await siteService.getSiteByWebflowId(siteId as string);
        if (!site) {
            res.status(400).json({message: "Site isn't found!"});
        }

        console.log("Registering custom code to site: ", siteId);

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        const collections = await webflowApiClient.getCmsCollections(site.siteId)

        console.log("from controller", collections)

        res.send({message:siteId, collections})
    } catch (err) {

        res.send({message: "500 Internal Server Error"})

    }

}

const createCmsCollections: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { siteId, displayName, slug, singularName } = req.body;

        if (!siteId || !displayName || !slug || !singularName) {
             res.status(400).json({ message: "Missing required fields!" });
        }

        const site = await siteService.getSiteByWebflowId(siteId as string);

        if (!site) {
            res.status(404).json({ message: "Site isn't found!" });
        }

        console.log("Registering custom code to site: ", siteId);

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        const collections = await webflowApiClient.createCmsCollections(site.siteId, {
            displayName,
            slug,
            singularName
        });

        console.log("from controller", collections);

        res.json({ message: "Collection created successfully!", collections });
    } catch (err) {
        console.error("Error creating collection:", err);
        res.status(500).json({ message: "500 Internal Server Error" });
    }
};

const getDetailsCmsCollectionList:RequestHandler = async(req:Request , res:Response):Promise<void> =>{

    try{
        const {siteId} = req.query
        const {collection_id} = req.params

        const site = await siteService.getSiteByWebflowId(siteId as string);
        if (!site) {
            res.status(400).json({message: "Collection isn't found!"});
        }

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        const detailsCmsCollection = await webflowApiClient.getDetailsCmsCollection(collection_id)

        console.log("from controller Details", detailsCmsCollection)

        res.send({message:siteId, detailsCmsCollection})
    } catch (err) {

        res.send({message: "500 Internal Server Error"})

    }

}

const deleteCmsCollectionList: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { siteId } = req.query;
        const { collection_id } = req.params;

        if (!siteId || !collection_id) {
           res.status(400).json({ message: "Missing required parameters!" });
        }

        const site = await siteService.getSiteByWebflowId(siteId as string);
        if (!site) {
            res.status(404).json({ message: "Site isn't found!" });
        }

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        const deletedCollection = await webflowApiClient.deleteDetailsCmsCollection(collection_id as string);

        if (!deletedCollection) {
             res.status(404).json({ message: "Collection not found or already deleted!" });
        }

        console.log("Collection deleted:", deletedCollection);

        res.json({ message: "Collection deleted successfully!", deletedCollection });
    } catch (err) {
        console.error("Error deleting collection:", err);
        res.status(500).json({ message: "500 Internal Server Error" });
    }
};

const createCollectionField: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { siteId } = req.query;
        const { collection_id } = req.params;
        const { name, slug, type, displayName, helpText } = req.body; // Expecting field details in request body

        if (!siteId || !collection_id || !name || !slug || !type) {
            res.status(400).json({ message: "Missing required parameters!" });
        }

        const site = await siteService.getSiteByWebflowId(siteId as string);
        if (!site) {
            res.status(404).json({ message: "Site isn't found!" });
        }

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        const collectionField = await webflowApiClient.createCollectionField(collection_id as string, {
            name,
            slug,
            type,
            displayName,
            helpText
        });

        if (!collectionField) {
           res.status(400).json({ message: "Field creation failed!" });
        }

        console.log("Created Collection Field:", collectionField);

        res.json({ message: "Field created successfully!", collectionField });
    } catch (err) {
        console.error("Error creating collection field:", err);
        res.status(500).json({ message: "500 Internal Server Error" });
    }
};

const updateCollectionField: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { siteId } = req.query;
        const { collection_id } = req.params;
        const { field_id } = req.body;

        if (!siteId || !collection_id || !field_id) {
            res.status(400).json({ message: "Missing required parameters!" });
        }

        const site = await siteService.getSiteByWebflowId(siteId as string);
        if (!site) {
            res.status(404).json({ message: "Site isn't found!" });
        }

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        const collectionField = await webflowApiClient.updateCollectionField(collection_id as string, field_id)

        if (!collectionField) {
            res.status(400).json({ message: "Field creation failed!" });
        }

        console.log("Updated Collection Field:", collectionField);

        res.json({ message: "Field updated successfully!", collectionField });
    } catch (err) {
        console.error("Error creating collection field:", err);
        res.status(500).json({ message: "500 Internal Server Error" });
    }
};

const deleteCollectionField: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { siteId } = req.query;
        const { collection_id } = req.params;
        const { field_id } = req.body;

        if (!siteId || !collection_id || !field_id) {
            res.status(400).json({ message: "Missing required parameters!" });
        }

        const site = await siteService.getSiteByWebflowId(siteId as string);
        if (!site) {
            res.status(404).json({ message: "Site isn't found!" });
        }

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        const collectionField = await webflowApiClient.deleteCollectionField(collection_id as string, field_id)

        // if (!collectionField) {
        //     res.status(400).json({ message: "Field deletion failed!" });
        // }

        console.log("Deleted Collection Field:", collectionField);

        res.json({ message: "Field deleted successfully!", collectionField });
    } catch (err) {
        console.error("Error d collection field:", err);
        res.status(500).json({ message: "500 Internal Server Error" });
    }
};


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
        const { name, slug } = req.body;

        const site = await siteService.getSiteByWebflowId(siteId as string);
        if (!site) {
            res.status(404).json({ message: "Site isn't found!" });
        }

        const webflowApiClient = new WebflowApiClient(site.user.accessToken);

        const collectionItem = await webflowApiClient.createCollectionItem(collection_id as string, {
            name,
            slug
        });

        if (!collectionItem) {
            res.status(400).json({ message: "Item creation failed!" });
        }

        console.log("Created Collection Item:", collectionItem);

        res.json({ message: "Item created successfully!", collectionItem });
    } catch (err) {
        console.error("Error creating collection Item:", err);
        res.status(500).json({ message: "500 Internal Server Error" });
    }
};

// const updateCollectionItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { siteId } = req.query;
//         const { collection_id, item_id } = req.params;
//         const { name, slug } = req.body;
//
//         const site = await siteService.getSiteByWebflowId(siteId as string);
//         if (!site) {
//             res.status(404).json({ message: "Site isn't found!" });
//         }
//
//         const webflowApiClient = new WebflowApiClient(site.user.accessToken);
//
//         if (!item_id) {
//             res.status(400).json({ message: "Item Updated failed!" });
//         }
//
//         const collectionItem = await webflowApiClient.updateCollectionItem(collection_id,item_id, {
//             name,
//             slug
//         });
//
//         res.json({ message: "Item Updated successfully!", collectionItem });
//     } catch (err) {
//         console.error("Error Updating collection Item:", err);
//         res.status(500).json({ message: "500 Internal Server Error" });
//     }
// };

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

const cmsController = {
    getCmsCollectionList,
    createCmsCollections,
    getDetailsCmsCollectionList,
    deleteCmsCollectionList,
    createCollectionField,
    updateCollectionField,
    deleteCollectionField,
    getCollectionItemsList,
    getCollectionItem,
    createCollectionItem,
    updateCollectionItem,
    deleteCollectionItem
};
export default cmsController;