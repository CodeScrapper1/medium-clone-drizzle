"use server";
import db from "@/db/drizzle";
import { story, topics } from "@/db/schema";
import { getUser } from "./user";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// get story by tagx
export const getUniqueTopics = async () => {
  try {
    const AllStoryTopics = await db
      .select({ topics: story.topics })
      .from(story);

    const uniqueTopics = Array.from(
      new Set(AllStoryTopics.flatMap((item) => item.topics))
    );

    const formattedData = uniqueTopics.map((topic) => ({
      value: topic,
      label: topic,
    }));

    return formattedData;
  } catch (error) {
    return [];
  }
};

//
export const GetSelectedTopics = async () => {
  const user: any = await getUser();

  try {
    const tags: any = await db.query.topics.findFirst({
      where: eq(topics.userId, user.id),
    });

    const formattedData = tags.topics.map((value: string) => ({
      value: value,
      label: value,
    }));
    return formattedData;
  } catch (error) {
    return [];
  }
};

// add remove tags
export const addRemoveTags = async (tags: any) => {
  const user: any = await getUser();
  let response;
  try {
    const tag: any = await db.query.topics.findFirst({
      where: eq(topics.userId, user.id),
    });
    console.log(tags, tag);

    if (tag) {
      response = await db
        .update(topics)
        .set({ topics: tags })
        .where(eq(topics.id, tag.id))
        .returning();
    } else {
      const data: any = { userId: user.id, topics: tags };
      response = await db.insert(topics).values(data).returning();
    }
  } catch (error) {
    return { error: "tags not updated" };
  }
  redirect("/");
};
