// import { CheckSaved } from "@/actions/Save";
import { getStoryById } from "@/actions/story";
import { getUserById } from "@/actions/user";
import RenderStory from "../RenderStory";

const page = async ({ params }: { params: { storyId: string } }) => {
  const PublishedStory: any = await getStoryById(params.storyId, true);
  if (!PublishedStory) {
    return <div>No Stories were found</div>;
  }
  const Author: any = await getUserById(PublishedStory?.userId);

  return (
    <div>
      <RenderStory
        AuthorName={Author.name}
        AuthorImage={Author.image}
        PublishedStory={PublishedStory}
      />
    </div>
  );
};

export default page;
