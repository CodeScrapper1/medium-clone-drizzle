import { Bookmark, CircleMinus, Ellipsis, MoreHorizontal } from "lucide-react";
import React from "react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage } from "./ui/avatar";
import SaveComponent from "./SaveComponent";
import { CheckFav } from "@/actions/favorite";
import ShareComponent from "./ShareComponent";
import { contentFormat } from "@/lib/data";

const StoryDetail = async ({ story }: any) => {
  const SavedStatus: any = await CheckFav(story.id);
  const formatedContent: any = await contentFormat(story?.content, 30);

  return (
    <div className="flex">
      <div className="">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              alt={story?.author?.name}
              src={`${story?.author?.image}?height=40&width=40`}
            />
          </Avatar>
          <div className="text-sm text-gray-500">{story?.author?.name}</div>
        </div>
        <div className="flex items-center gap-2">
          <div>
            <h2 className="text-xl font-bold">
              {formatedContent?.h1elemntwithouttag}
            </h2>
            <p className="text-sm">{formatedContent?.firstWords}</p>
            <div className="flex justify-between items-center mt-10">
              <div className="flex gap-3">
                {story.topics?.map((topic: string) => (
                  <div className="text-gray-500 text-sm">
                    <Badge variant="secondary"> {topic}</Badge>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mr-8">
                <div className="flex items-center space-x-4">
                  <SaveComponent storyId={story.id} SavedStatus={SavedStatus} />
                  <ShareComponent />
                  <button>
                    <MoreHorizontal
                      size={24}
                      className="opacity-80 text-green-800"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <img
            alt="Ameer Omidvar"
            src={formatedContent?.imgSrc}
            className="w-40"
          />
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
