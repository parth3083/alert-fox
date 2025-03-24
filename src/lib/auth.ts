import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

export async function getUser() {
  try {
    const prisma = new PrismaClient();
    const auth = await currentUser();
    if (!auth) {
      throw new Error("Not authenticated");
    }
      const user = await prisma.user.findUnique({
          where: {
        externalId: auth.id,
    }
})
    if (!user) {
      throw new Error("Not authenticated");
    }
    return user;
  } catch (error) {
    console.error("Authentication Error", error);
    return null;
  }
}
