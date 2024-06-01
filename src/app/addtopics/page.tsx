import { GetSelectedTopics, getUniqueTopics } from "@/actions/topics";
import AddTagComp from "@/components/AddTagComp";
import React from "react";

const AddTopics = async () => {
  const UserTags = await GetSelectedTopics();
  return <AddTagComp UserTags={UserTags} />;
};

export default AddTopics;
