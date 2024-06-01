import { getStoryById } from "@/actions/story";
import { getUser } from "@/actions/user";
import NavbarStory from "@/components/NavbarStory";
import NewStory from "@/components/NewStory";
import React from "react";

const StoryById = async ({ params }: { params: { storyId: string } }) => {
  const Story: any = await getStoryById(params.storyId, false);
  const User: any = await getUser();
  console.log(Story, "Story");
  return (
    <div>
      <NavbarStory
        storyId={params.storyId}
        CurrentUserName={User?.name || ""}
      />
      <NewStory storyId={params.storyId} Storycontent={Story.content} />
    </div>
  );
};

export default StoryById;
