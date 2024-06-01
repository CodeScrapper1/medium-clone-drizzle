"use server";
import db from "@/db/drizzle";
import { story } from "@/db/schema";
import { getAuthSession } from "@/lib/auth";
import { getUser } from "./user";
import { redirect } from "next/navigation";
import { and, arrayContained, arrayContains, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const CreateStory = async () => {
  const session: any = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }
  let NewStory;
  try {
    const user: any = await getUser();

    NewStory = await db.insert(story).values({ userId: user.id }).returning();
    if (!NewStory.length) {
      return { error: "Story not created" };
    }
  } catch (error) {
    return { error: "Story not created" };
  }
  redirect(`/story/${NewStory[0].id}`);
};

// get story
export const getStoryById = async (storyId: string, isPublish: boolean) => {
  console.log(storyId, "storyId");
  if (!storyId) {
    throw new Error("Do not have storyId");
  }
  let StoryById;
  try {
    StoryById = await db.query.story.findFirst({
      where: and(eq(story.id, storyId), eq(story.publish, isPublish)),
    });
    if (!StoryById) {
      return { error: "Error on getting the story by Id" };
    }
  } catch (error) {
    return { error: "Error on getting the story by Id" };
  }
  return StoryById;
};

// update story
export const updateStory = async ({
  storyId,
  content,
}: {
  storyId: string;
  content: any;
}) => {
  if (!storyId || !content) {
    return { error: "please fill all fields" };
  }

  const Story = await db.query.story.findFirst({
    where: eq(story.id, storyId),
  });

  if (!Story) {
    return { error: "No story were found" };
  }
  let udpateData;
  try {
    udpateData = await db
      .update(story)
      .set({ content })
      .where(eq(story.id, storyId))
      .returning();

    if (!udpateData.length) {
      return { error: "No story updated" };
    }
  } catch (error) {
    return { error: "No story updated" };
  }
  revalidatePath(`/story/${storyId}`);
  return { result: udpateData };
};

// publish story
export const publishNewStory = async ({ storyId, topics }: any) => {
  if (!storyId || !topics.length) {
    return { error: "please provide complete information" };
  }

  const Story = await db.query.story.findFirst({
    where: eq(story.id, storyId),
  });

  if (!Story) {
    return { error: "No story found" };
  }
  let updatedStory: any;
  try {
    updatedStory = await db
      .update(story)
      .set({ topics, publish: true })
      .where(eq(story.id, storyId))
      .returning();
    console.log(updatedStory, "updatedStory");
    if (!updatedStory?.length) {
      return { error: "Story not published" };
    }
  } catch (error) {
    return { error: "No story updated" };
  }
  redirect(`/published/${updatedStory?.[0].id}`);
};

// get stories
export const getStories = async (tag: string) => {
  let stories;
  try {
    if (tag) {
      stories = await db.query.story.findMany({
        where: arrayContains(story.topics, [tag]),
        with: { author: true },
      });
    } else {
      stories = await db.query.story.findMany({
        with: { author: true },
      });
    }
    if (!stories) {
      return { error: "Error on getting the stories" };
    }
  } catch (error) {
    return { error: "Error on getting the stories" };
  }
  return stories;
};
