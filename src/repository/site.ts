import { db } from "@/db";
import { Prisma } from "@prisma/client";

async function getSiteByWebflowId(siteId: string) {
  const site = await db.site.findFirst({
    where: { siteId },
    include: {
      user: true,
    },
  });

  return site;
}

async function updateSite(siteId: string, data: Prisma.SiteUpdateInput) {
  return db.site.update({
    data,
    where: { siteId },
  });
}

const siteService = {
  getSiteByWebflowId,
  updateSite,
};

export default siteService;
