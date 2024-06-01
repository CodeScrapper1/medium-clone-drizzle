import { useEffect } from "react";
import UserBadge from "./UserBadge";
import ClapComponent from "./ClapComponent";

const ReplyComments = ({
  storyId,
  comment,
}: {
  storyId: string;
  comment: any;
}) => {
  useEffect(() => {}, [storyId]);

  return (
    <div>
      {/* <RenderComments storyId={storyId} parentCommentId={parentCommentId} /> */}
      <div className="mt-10 border-t-[1px]">
        {comment?.replies?.map((reply: any, index: number) => {
          const clapCounts = reply?.clap?.map((clap: any) => clap.clapCount);
          const totalClaps = clapCounts?.reduce(
            (acc: any, curr: any) => acc + curr,
            0
          );
          return (
            <div
              key={index}
              className="m-4 mt-5 py-4 border-b-[1px] border-neutral-100"
            >
              <UserBadge userId={reply.userId} createdAt={reply.createdAt} />
              <p className="py-3 text-neutral-600 text-sm ml-3">
                {reply.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ClapComponent
                    storyId={comment.storyId}
                    ClapCount={totalClaps}
                    commentId={reply.id}
                    type="replyId"
                    UserClaps={0}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReplyComments;
