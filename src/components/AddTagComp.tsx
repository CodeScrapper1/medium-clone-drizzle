"use client";
import { addRemoveTags } from "@/actions/topics";
import { topics } from "@/lib/data";
import { useState } from "react";
import Select from "react-select";

type TagsTyps = {
  UserTags: {
    value: string;
    label: string;
  }[];
};

const AddTagComp = ({ UserTags }: TagsTyps) => {
  const [selectedtopics, setSelectedTopics] = useState<string[]>([]);
  console.log(UserTags, "UserTags");
  const Addtags = async () => {
    try {
      await addRemoveTags(selectedtopics);
      console.log("Added tags successfully");
    } catch (error) {
      console.log("Error adding tags");
    }
  };

  return (
    <div className="fixed bg-gray-50 w-full z-20 overflow-auto top-0 left-0 right-0 bottom-0">
      <div className="max-w-[900px] mx-auto md:mt-28 mt-10 w-full">
        <div>
          <Select
            placeholder="tags"
            isMulti
            defaultValue={UserTags}
            onChange={(selectedvalues) => {
              const values = selectedvalues as {
                value: string;
                label: string;
              }[];

              const stringValues = values.map((value) => value.value);
              setSelectedTopics(stringValues);
            }}
            isOptionDisabled={() => selectedtopics?.length >= 5}
            name="topics"
            options={topics}
            className="basic-multi-select"
            classNamePrefix="Add a topic ..."
          />
          <button
            onClick={Addtags}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white text-sm mt-8"
          >
            Add Tags
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTagComp;
