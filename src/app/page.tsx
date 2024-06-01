import Topics from "@/components/Topics";
import GetPosts from "@/components/GetPosts";
import Sidebar from "@/components/Sidebar";
import { GetSelectedTopics, getUniqueTopics } from "@/actions/topics";
import { getStories } from "@/actions/story";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { tag: string };
}) {
  const allTopics = await getUniqueTopics();
  const UserTags = await GetSelectedTopics();
  const stories = await getStories(searchParams.tag);
  return (
    <div className="w-full max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.5fr] gap-20 justify-between">
        <div className="py-8">
          <Topics allTopics={allTopics} UserTags={UserTags} />
          <GetPosts stories={stories} />
        </div>
        <Sidebar />
      </div>
    </div>
  );
}
