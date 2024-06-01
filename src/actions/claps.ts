"use server";
import db from "@/db/drizzle";
import { clap, story } from "@/db/schema";
import { and, eq, isNull, ne, sql, sum } from "drizzle-orm";
import { getUser } from "./user";
import { getStoryById } from "./story";
import { getAuthSession } from "@/lib/auth";

export const ClapCount = async (storyId: string, commentId?: string) => {
  try {
    if (commentId) {
      const response = await db
        .select({
          clapCount: sql`cast(sum(${clap.clapCount}) as int)`.as("clapCount"),
        })
        .from(clap)
        .where(and(eq(clap.storyId, storyId), eq(clap.commentId, commentId)))
        .groupBy(clap.storyId);
      return response?.[0]?.clapCount || 0;
    }

    const response = await db
      .select({
        clapCount: sql`cast(sum(${clap.clapCount}) as int)`.as("clapCount"),
      })
      .from(clap)
      .where(and(eq(clap.storyId, storyId)))
      .groupBy(clap.storyId);
    return response?.[0]?.clapCount || 0;
  } catch (error) {
    return 0;
  }
};

export const ClapCountByUser = async (storyId: string, commentId?: string) => {
  const user: any = await getUser();
  if (!user) throw new Error("No logged user");

  try {
    if (commentId) {
      const response = await db
        .select({
          clapCount: sql`cast(sum(${clap.clapCount}) as int)`.as("clapCount"),
        })
        .from(clap)
        .where(
          and(
            eq(clap.storyId, storyId),
            eq(clap.userId, user.id),
            eq(clap.commentId, commentId)
          )
        );

      // .groupBy(clap.storyId);
      return response?.[0]?.clapCount || 0;
    }

    const response = await db
      .select({
        clapCount: sql`cast(sum(${clap.clapCount}) as int)`.as("clapCount"),
      })
      .from(clap)
      .where(and(eq(clap.storyId, storyId), eq(clap.userId, user.id)));

    // .groupBy(clap.storyId);
    return response?.[0]?.clapCount || 0;
  } catch (error) {
    return 0;
  }
};

//
export const updateClapCount = async (storyId: string) => {
  const user: any = await getUser();

  let claps;
  try {
    const Story = await getStoryById(storyId, true);

    if (!Story) {
      return { error: "Story not found" };
    }

    const clapped = await db.query.clap.findFirst({
      where: and(
        eq(clap.storyId, storyId),
        eq(clap.userId, user.id),
        isNull(clap.commentId),
        isNull(clap.replyId)
      ),
    });
    if (clapped) {
      claps = await db
        .update(clap)
        .set({ clapCount: sql`${clap.clapCount} + 1` })
        .where(eq(clap.id, clapped.id))
        .returning();
    } else {
      const data: any = { userId: user.id, clapCount: 1, storyId };
      claps = await db.insert(clap).values(data).returning();
      console.log(claps, "claps");
    }
  } catch (error) {
    return { error: "clap not updated" };
  }
  return claps[0];
};

// update reply clap
export const updateReplyClapCount = async (
  storyId: string,
  id: string,
  type?: string
) => {
  const user: any = await getUser();

  let claps;
  try {
    const Story = await getStoryById(storyId, true);

    if (!Story) {
      return { error: "Story not found" };
    }
    const commentType = type == "commentId" ? clap.commentId : clap.replyId;
    const clapped = await db.query.clap.findFirst({
      where: and(
        eq(clap.storyId, storyId),
        eq(clap.userId, user.id),
        eq(commentType, id)
      ),
    });
    if (clapped) {
      claps = await db
        .update(clap)
        .set({ clapCount: sql`${clap.clapCount} + 1` })
        .where(eq(clap.id, clapped.id))
        .returning();
    } else {
      const data: any = {
        userId: user.id,
        clapCount: 1,
        storyId,
        ...(type == "commentId" ? { commentId: id } : { replyId: id }),
      };
      claps = await db.insert(clap).values(data).returning();
    }
  } catch (error) {
    return { error: "clap not updated" };
  }
  return claps[0];
};
