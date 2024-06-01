import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import React from "react";
import "highlight.js/styles/github.css";
import { getUser } from "@/actions/user";
import { ClapCount, ClapCountByUser } from "@/actions/claps";
import { NumberOfComments } from "@/actions/comments";
import ClapComponent from "@/components/ClapComponent";
import CommentComponent from "./CommentComponent";
import SaveComponent from "@/components/SaveComponent";
import { CheckFav } from "@/actions/favorite";
import ShareComponent from "./ShareComponent";
import { contentFormat } from "@/lib/data";

type Props = {
  AuthorName: string | null;
  AuthorImage: string;
  PublishedStory: any;
};

const RenderStory = async ({
  AuthorName,
  AuthorImage,
  PublishedStory,
}: Props) => {
  const content = PublishedStory?.content!;
  const formatedContent: any = await contentFormat(content, 10);

  const clapCounts: any = await ClapCount(PublishedStory.id);
  const UserClaps: any = await ClapCountByUser(PublishedStory.id);
  const CurrentUser: any = await getUser();

  const NumberCommnets = await NumberOfComments(PublishedStory.id);
  const SavedStatus: any = await CheckFav(PublishedStory.id);
  console.log(SavedStatus, "SavedStatus");

  return (
    <div className="flex items-center justify-center mt-6 max-w-[800px] mx-auto">
      <div>
        <h1 className="text-4xl font-bold my-8">
          {formatedContent?.h1elemntwithouttag}
        </h1>
        <div className="flex items-center space-x-5">
          <Image
            src={AuthorImage}
            className="rounded-full"
            width={44}
            height={44}
            alt="User"
          />
          <div className="text-sm">
            <p className="opacity-60">
              Published on{" "}
              {new Date(PublishedStory.updatedAt)
                .toDateString()
                .split(" ")
                .slice(1, 4)
                .join(" ")}
            </p>
          </div>
        </div>
        <div className="border-y-[1px] border-neutral-200 py-3 mt-6 flex items-center justify-between px-3">
          <div className="flex items-center space-x-4">
            <ClapComponent
              storyId={PublishedStory.id}
              ClapCount={clapCounts}
              UserClaps={UserClaps}
            />
            <CommentComponent
              NumberCommnets={NumberCommnets}
              AuthorName={CurrentUser.name}
              AuthorImage={CurrentUser.image}
            />
          </div>
          <div className="flex items-center space-x-4">
            <SaveComponent
              storyId={PublishedStory.id}
              SavedStatus={SavedStatus}
            />
            <ShareComponent />
            <button>
              <MoreHorizontal size={24} className="opacity-80 text-green-800" />
            </button>
          </div>
        </div>
        <div
          className="prose my-5 font-mono"
          dangerouslySetInnerHTML={{
            __html: formatedContent?.finalSanitizedContent,
          }}
        ></div>
      </div>
    </div>
  );
};

export default RenderStory;
