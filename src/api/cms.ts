import cmsController from "@/controllers/cmsController";
import express from "express";

const cmsRouter = express.Router();

cmsRouter.get('/collections',cmsController.getCmsCollectionList)
cmsRouter.post('/collections',cmsController.createCmsCollections)
cmsRouter.get('/collections/:collection_id',cmsController.getDetailsCmsCollectionList)
cmsRouter.delete('/collections/:collection_id',cmsController.deleteCmsCollectionList)
cmsRouter.post('/collections/:collection_id/fields',cmsController.createCollectionField)
cmsRouter.patch('/collections/:collection_id/fields/:field_id',cmsController.updateCollectionField)
cmsRouter.delete('/collections/:collection_id/fields/:field_id',cmsController.deleteCollectionField)
cmsRouter.get('/collections/:collection_id/items',cmsController.getCollectionItemsList)
cmsRouter.get('/collections/:collection_id/items/:item_id',cmsController.getCollectionItem)
cmsRouter.post('/collections/:collection_id/items',cmsController.createCollectionItem)
cmsRouter.post('/collections/:collection_id/items/bulk',cmsController.createCollectionItem)
cmsRouter.patch('/collections/:collection_id/items/:item_id',cmsController.updateCollectionItem)
cmsRouter.delete('/collections/:collection_id/items/:item_id',cmsController.deleteCollectionItem)



export default cmsRouter;
