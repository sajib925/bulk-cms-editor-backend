import { ScriptConfig } from "@/config/scripts";
import {CmsFieldType, WebflowAuthenticatedUser, WebflowCustomScript} from "@/lib/type/type";
import {Webflow, WebflowClient} from "webflow-api"
import { CustomCodeHostedResponse, ScriptApplyList, Site, Sites } from "webflow-api/api";





class WebflowApiClient {
    client: WebflowClient;
  
    constructor(accessToken: string) {
      this.client = new WebflowClient({
         accessToken
      });
    }

    getAuthenticatedUser = async (): Promise<WebflowAuthenticatedUser> => {
        const data = await this.client.token.authorizedBy()
        return data as WebflowAuthenticatedUser;
    };

    getSite = async (siteId: string): Promise<Site> => {
        return await this.client.sites.get(siteId);
    };

    getSitesList = async (): Promise<Sites> => {
        return await this.client.sites.list();
    };


    getListOfCustomCodes = async (siteId:string)=>{
        try {
            const {registeredScripts} = await this.client.scripts.list(siteId)
            console.log("",registeredScripts);
            return registeredScripts

        } catch (error) {
            console.log(error);
            if (error instanceof Webflow.NotFoundError) return []  
        }
    }

 
    
    addCustomCode = async (
        siteId: string,
        script: CustomCodeHostedResponse & { location: "header" | "footer" }
    ): Promise<CustomCodeHostedResponse> => {
        const prevCodeList = await this.getListOfCustomCodes(siteId);
    
        const res = await this.client.sites.scripts.upsertCustomCode(siteId, {
            scripts: [
                {
                    id: script.id,
                    version: script.version,
                    location: script.location
                }
            ]
        })
    
        return res.scripts.reverse()[0];
    };
    
    deleteCustomCode = async (siteId: string): Promise<void> => {
        return await this.client.sites.scripts.deleteCustomCode(siteId);
    };
    
    getListOfRegisteredScripts = async (
        siteId: string
    ): Promise<ScriptApplyList> => {
        return await this.client.sites.scripts.getCustomCode(siteId);
    };
    
    registerScript = async (siteId: string, scriptConfig: ScriptConfig): Promise<CustomCodeHostedResponse> => {
        const {status, script} = await this.checkScriptRegistrationStatus(siteId, scriptConfig);
    
        if (status && script) {
            return script;
        }
    
        // if (scriptConfig.hosted)
        return this.registerHostedScript(siteId, scriptConfig);
    };
    
    checkScriptRegistrationStatus = async (
        siteId: string,
        scriptConfig: ScriptConfig
    ): Promise<{ status: boolean; script?: WebflowCustomScript }> => {
        const registeredScripts
            = await this.getListOfRegisteredScripts(siteId);
            console.log('api client', registeredScripts);
            
    
        // for (let script of registeredScripts) {
        //     if (script.displayName === scriptConfig.displayName && script.version === scriptConfig.version) {
        //         return {
        //             status: true,
        //             script,
        //         };
        //     }
        // }
    
        return {status: false};
    };
    
    registerHostedScript = async (siteId: string, scriptConfig: ScriptConfig): Promise<CustomCodeHostedResponse> => {
        const {displayName, version, hostedLocation, integrityHash} = scriptConfig;
    
        return await this.client.scripts.registerHosted(siteId, {
            displayName,
            integrityHash,
            version,
            hostedLocation
        });
    };

    getCmsCollections = async(siteId:string)=>{
        try {
            const collections = await this.client.collections.list(siteId)
            return collections.collections;
        } catch (e) {
            if (e instanceof Webflow.NotFoundError) return []
        }


    }



    createCmsCollections = async (
        siteId: string,
        collectionData: { displayName: string; slug: string; singularName: string }
    ) => {
        try {
            const collections = await this.client.collections.create(siteId, collectionData);

            console.log("Collection created:", collections);
            return collections;
        } catch (e) {
            console.error("Error creating collection:", e);
            if (e instanceof Webflow.NotFoundError) return [];
        }
    };

    getDetailsCmsCollection = async(collection_id:string)=>{
        try {
            const detailsCollection = await this.client.collections.get(collection_id);
            console.log("from client api",detailsCollection);
            return detailsCollection;
        } catch (e) {
            if (e instanceof Webflow.NotFoundError) return []
        }

    }

    deleteDetailsCmsCollection = async(collection_id:string)=>{
        try {
            const detailsCollection = await this.client.collections.delete(collection_id);
            console.log("from client api",detailsCollection);
            return detailsCollection;
        } catch (e) {
            if (e instanceof Webflow.NotFoundError) return []
        }

    }

    createCollectionField = async (collection_id: string, fieldData: { name: string; slug: string; type: CmsFieldType; displayName: string; helpText: string }) => {
        try {
            const field = await this.client.collections.fields.create(collection_id, fieldData);
            console.log("Created Field:", field);
            return field;
        } catch (e) {
            if (e instanceof Webflow.NotFoundError) return null;
        }
    };

    updateCollectionField = async (collection_id: string, field_id: string) => {
        try {
            const field = await this.client.collections.fields.update(collection_id, field_id);
            console.log("Updated Field:", field);
            return field;
        } catch (e) {
            if (e instanceof Webflow.NotFoundError) return null;
        }
    };

    deleteCollectionField = async (collection_id: string, field_id: string) => {
        try {
            const field = await this.client.collections.fields.delete(collection_id, field_id);
            console.log("Deleted Field:", field);
            return field;
        } catch (e) {
            if (e instanceof Webflow.NotFoundError) return null;
        }
    };

    getCollectionItems = async(collection_id:string)=>{
        try {
            const collectionItems = await this.client.collections.items.listItems(collection_id);
            console.log("from client api",collectionItems);
            return collectionItems;
        } catch (e) {
            if (e instanceof Webflow.NotFoundError) return []
        }

    }

    getCollectionItem = async(collection_id:string, item_id:string)=>{
        try {
            const collectionItem = await this.client.collections.items.getItem(collection_id, item_id)
            console.log("from client api",collectionItem);
            return collectionItem;
        } catch (e) {
            if (e instanceof Webflow.NotFoundError) return []
        }

    }

    createCollectionItems = async (
        collection_id: string,
        // items: Array<{ fields: Record<string, any> }>
        items: Array<{ fields: { name: string; slug: string; [key: string]: any } }>

    ) => {
        try {
            const createdItems = [];

            for (const item of items) {
                const collection = await this.client.collections.items.createItem(collection_id, {
                    fieldData: item.fields
                });
                createdItems.push(collection);
            }

            console.log("Collections created:", createdItems);
            return createdItems;
        } catch (e) {
            console.error("Error creating collections:", e);
            if (e instanceof Webflow.NotFoundError) return [];
            throw e;
        }
    };




    updateCollectionItem = async (
        collection_id: string,
        item_id: string,
        fieldData: Record<string, any>
    ) => {
        try {
            const collections = await this.client.collections.items.updateItem(
                collection_id,
                item_id,
                { fieldData }
            );

            console.log("Collection Item Updated:", collections);
            return collections;
        } catch (e) {
            console.error("Error Updating collection:", e);
            if (e instanceof Webflow.NotFoundError) return [];
        }
    };


    updateCollectionItems = async (
        collection_id: string,
        items: Array<{ _id: string; fields: Record<string, any> }>
    ) => {
        try {
            console.log('Items to update:', items);

            const formattedItems = items.map(({ _id, fields }, index) => {
                if (!fields) {
                    console.warn(`Item at index ${index} has missing fields data`);
                    return {
                        id: _id,
                        fieldData: {},
                    };
                }

                if (typeof fields !== 'object' || Array.isArray(fields)) {
                    console.warn(`Item at index ${index} has invalid fieldData:`, fields);
                    throw new Error(`Invalid fieldData for item at index ${index}`);
                }

                return {
                    id: _id,
                    fieldData: fields,
                };
            });

            const response = await this.client.collections.items.updateItems(collection_id, {
                items: formattedItems,
            });

            console.log("Bulk Collection Items Updated:", response);
            return response;
        } catch (e) {
            console.error("Error updating collection items:", e);
            if (e instanceof Webflow.NotFoundError) return [];
            throw e;
        }
    };



    deleteCollectionItem = async(collection_id:string, item_id:string)=>{
        try {
            const collectionItem = await this.client.collections.items.deleteItem(collection_id, item_id)
            console.log("from client api",collectionItem);
            return collectionItem;
        } catch (e) {
            if (e instanceof Webflow.NotFoundError) return []
        }
    }


    publishCollectionItem = async (collection_id: string, itemIds: string[]) => {
        try {
            const response = await this.client.collections.items.publishItem(collection_id, {
                itemIds: itemIds
            });
            console.log("Publish Response:", response);

            const { publishedItemIds, errors } = response;

            return {
                success: publishedItemIds || [],
                errors: errors || []
            };
        } catch (e) {
            if (e instanceof Webflow.NotFoundError) return []
        }
    }


}

export default WebflowApiClient