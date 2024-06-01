import React from "react";
import StaffPics from "./StaffPics";
import Ads from "./Ads";
import RecommendedTopics from "./RecommendedTopics";

const Sidebar = () => {
  return (
    <div className="sticky pl-10 border-l-[1px]">
      <StaffPics />
      <Ads />
      <RecommendedTopics />
    </div>
  );
};

export default Sidebar;
