import cmsController from "@/controllers/cmsController";
import express from "express";
import cmsItemsController from "@/controllers/cmsItemsController";

const cmsRouter = express.Router();

cmsRouter.get('/collections',cmsController.getCmsCollectionList)
cmsRouter.post('/collections',cmsController.createCmsCollections)
cmsRouter.get('/collections/:collection_id',cmsController.getDetailsCmsCollectionList)
cmsRouter.delete('/collections/:collection_id',cmsController.deleteCmsCollectionList)

cmsRouter.post('/collections/:collection_id/fields',cmsController.createCollectionField)
cmsRouter.patch('/collections/:collection_id/fields/:field_id',cmsController.updateCollectionField)
cmsRouter.delete('/collections/:collection_id/fields/:field_id',cmsController.deleteCollectionField)

cmsRouter.get('/collections/:collection_id/items',cmsItemsController.getCollectionItemsList)
cmsRouter.get('/collections/:collection_id/items/:item_id',cmsItemsController.getCollectionItem)
cmsRouter.post('/collections/:collection_id/items',cmsItemsController.createCollectionItem)
cmsRouter.post('/collections/:collection_id/items/bulk',cmsItemsController.createCollectionItem)
cmsRouter.patch('/collections/:collection_id/items',cmsItemsController.updateCollectionItems)
cmsRouter.patch('/collections/:collection_id/items/:item_id',cmsItemsController.updateCollectionItem)
cmsRouter.delete('/collections/:collection_id/items/:item_id',cmsItemsController.deleteCollectionItem)



export default cmsRouter;
