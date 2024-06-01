"use server";

import db from "@/db/drizzle";
import { comment, reply, story } from "@/db/schema";
import { getAuthSession } from "@/lib/auth";
import { and, count, eq } from "drizzle-orm";
import { getStoryById } from "./story";
import { getUser } from "./user";
import { revalidatePath } from "next/cache";

export const getAllComments = async (storyId: string) => {
  if (!storyId) {
    return { error: "required data is not provided" };
  }
  let Comments;
  try {
    Comments = await db.query.comment.findMany({
      where: eq(comment.storyId, storyId),
      with: {
        clap: true,
        replies: { with: { clap: true } },
      },
    });
    if (!Comments?.length) {
      return { error: "not getting comments" };
    }
  } catch (error) {
    console.log("Error getting the story comments");
    return { error: "Error getting the story comments" };
  }
  revalidatePath(`/published/${storyId}`);
  return Comments;
};

export const NumberOfComments = async (storyId: string) => {
  try {
    const response = await db
      .select({ count: count() })
      .from(comment)
      .where(eq(comment.storyId, storyId));
    console.log(response, "response");
    return response?.[0]?.count || 0;
  } catch (error) {
    return { error: "Error getting number oof comments" };
  }
};

// comment story
export const commentStory = async (
  storyId: string,
  Content?: string,
  commentId?: string
) => {
  const user: any = await getUser();
  if (!storyId || !Content) {
    return { error: "Insuficient data" };
  }
  let Comment;

  try {
    await getStoryById(storyId, true);
    if (!commentId) {
      const data: any = {
        userId: user.id,
        storyId,
        content: Content,
      };
      Comment = await db.insert(comment).values(data).returning();
    } else {
      const data: any = {
        userId: user.id,
        commentId,
        content: Content,
      };
      Comment = await db.insert(reply).values(data).returning();
    }
    console.log(Comment, "Comment");
  } catch (error) {
    return { error: "Error getting the story comments" };
  }
  revalidatePath(`/published/${storyId}`);
};
