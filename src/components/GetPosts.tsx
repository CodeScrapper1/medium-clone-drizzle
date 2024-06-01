import React from "react";
import StoryDetail from "./StoryDetail";

const GetPosts = ({ stories }: any) => {
  return (
    <div className="space-y-10 py-4">
      {stories?.map((item: any, index: number) => (
        <StoryDetail key={index} story={item} />
      ))}
    </div>
  );
};

export default GetPosts;
