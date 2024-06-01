"use client";
import React from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Topics = ({ allTopics, UserTags }: { allTopics: any; UserTags: any }) => {
  const { status }: { status: string } = useSession();
  return (
    <div className="space-y-1">
      <div className="flex space-x-2 items-center">
        {status == "authenticated" ? (
          <>
            <Link
              href="/addtopics"
              className="px-4 text-gray-400 hover:text-black hover:bg-slate-100 py-2 rounded-sm"
            >
              <Plus />
            </Link>
            <Link
              href="/"
              className="px-4 text-gray-400 hover:text-black hover:bg-slate-100 py-2 rounded-sm"
            >
              For you
            </Link>
            {UserTags?.map((topic: any, index: number) => (
              <Link
                key={index}
                href={`/?tag=${topic.value}`}
                className="px-4 text-gray-400 hover:text-black hover:bg-slate-100 py-2 rounded-sm"
              >
                {topic.label}
              </Link>
            ))}
          </>
        ) : (
          allTopics?.map((topic: any, index: number) => (
            <Link
              key={index}
              href={`/?tag=${topic.value}`}
              className="px-4 text-gray-400 hover:text-black hover:bg-slate-100 py-2 rounded-sm"
            >
              {topic.label}
            </Link>
          ))
        )}
      </div>
      <div className="h-[1px] bg-gray-200" />
    </div>
  );
};

export default Topics;
