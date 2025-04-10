import { db } from "@/db";
import { Prisma } from "@prisma/client";

async function upsertUserAndSites(user: Prisma.UserCreateInput, sites: Prisma.SiteCreateInput[]) {
  const savedUser = await db.user.upsert({
    where: { email: user.email },
    create: user,
    update: user,
  });

  const savedSites = await db.$transaction(
    sites.map((site) =>
      db.site.upsert({
        where: { siteId: site.siteId },
        create: { ...site, user: { connect: { id: savedUser.id } } },
        update: { ...site, user: { connect: { id: savedUser.id } } },
      })
    )
  );

  return {
    ...savedUser,
    sites: savedSites,
  };
}

const userRepository = {
  upsertUserAndSites,
};

export default userRepository;
