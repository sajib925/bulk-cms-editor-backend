import { WebflowAuthenticatedUser, WebflowSite } from "@/lib/type/type";
import { Prisma } from "@prisma/client";
import { Site } from "webflow-api/api";

const serializeWebflowAuthenticatedUserToDbUser = (
  user: WebflowAuthenticatedUser,
  accessToken: string
): Prisma.UserCreateInput => {
  const { id, ...rest } = user;
  return {
    webflowUserId: id,
    ...rest,
    accessToken,
  };
};

const serializeWeblfowSiteToDbSite = (site: Site) => {
  const { id, displayName, previewUrl, workspaceId } = site;

  return {
    siteId: id,
    displayName,
    previewUrl,
    workspaceId,
  };
};

const serializedWebflowSitesListToDbSites = (sites: Site[]): Prisma.SiteCreateInput[] => {
  return sites.map((site) => {
    const { id, displayName, previewUrl, workspaceId } = site;

    return {
      siteId: id,
      displayName,
      previewUrl,
      workspaceId,
    };
  });
};

const webflowDataSerializer = {
  serializeWebflowAuthenticatedUserToDbUser,
  serializeWeblfowSiteToDbSite,
  serializedWebflowSitesListToDbSites,
};

export default webflowDataSerializer;
