"use server";
import db from "@/db/drizzle";
import { getUser } from "./user";
import { and, eq } from "drizzle-orm";
import { save, story } from "@/db/schema";
import { getStoryById } from "./story";
import { revalidatePath } from "next/cache";

export const CheckFav = async (storyId: string) => {
  const user: any = await getUser();

  let fav;
  try {
    fav = await db.query.save.findFirst({
      where: and(eq(save.userId, user.id), eq(save.storyId, storyId)),
    });
  } catch (error) {
    return { Status: false };
  }
  return !!fav;
};

// create fav
export const addToFav = async (storyId: string) => {
  const user: any = await getUser();
  let fav;
  try {
    const Story = await getStoryById(storyId, true);

    if (!Story) {
      return { error: "Story does not exist" };
    }
    fav = await db.query.save.findFirst({
      where: and(eq(save.storyId, storyId), eq(save.userId, user.id)),
    });
    console.log(fav, "fav");
    if (fav) {
      await db.delete(save).where(eq(save.id, fav.id));
    } else {
      fav = await db
        .insert(save)
        .values({ userId: user.id, storyId })
        .returning();
    }
  } catch (error) {
    return { error: "not added in fav" };
  }
  revalidatePath(`/published/${storyId}`);
  return fav;
};
