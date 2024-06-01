"use client";
import { useEffect, useState } from "react";
import UserBadge from "./UserBadge";
import { getAllComments } from "@/actions/comments";
import UserEngagement from "./UserEngagement";

const RenderComments = ({
  storyId,
  showSideComp,
}: {
  storyId: string;
  parentCommentId?: string;
  showSideComp?: any;
}) => {
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const result: any = await getAllComments(storyId);
        if (result?.length) {
          setComments(result);
        } else {
          console.log(result.error);
        }
      } catch (error) {
        console.log("Error fetching comments", error);
      }
    };

    fetchComments();
  }, [showSideComp]);

  return (
    <div className="mt-10 border-t-[1px]">
      {comments.map((comment: any, index: number) => {
        const clapCounts = comment.clap.map((clap: any) => clap.clapCount);
        const totalClaps = clapCounts.reduce(
          (acc: any, curr: any) => acc + curr,
          0
        );
        return (
          <div
            key={index}
            className="m-4 mt-5 py-4 border-b-[1px] border-neutral-100"
          >
            <UserBadge userId={comment.userId} createdAt={comment.createdAt} />
            <p className="py-3 text-neutral-600 text-sm ml-3">
              {comment.content}
            </p>
            <UserEngagement totalClaps={totalClaps} comment={comment} />
          </div>
        );
      })}
    </div>
  );
};

export default RenderComments;
