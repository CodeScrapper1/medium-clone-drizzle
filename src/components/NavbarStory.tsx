"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getStoryById, publishNewStory } from "@/actions/story";
import { contentFormat, topics } from "@/lib/data";
import { toast } from "./ui/use-toast";

type Props = {
  storyId: string;
  CurrentUserName: string | null;
};

const NavbarStory = ({ storyId, CurrentUserName }: Props) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  console.log(storyId, "storyId");
  const PublishStory = async (topics: string[]) => {
    try {
      const response: any = await publishNewStory({
        storyId,
        topics,
      });
      if (response.error) {
        toast({ title: response.error });
      }
    } catch (error) {
      console.log("Error publishing the story", error);
    }
  };
  return (
    <div className="px-8 py-2 border-b-[1px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Image
              src="/medium-icon.svg"
              width={40}
              height={40}
              alt="Medium Logo"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-7">
          <button
            onClick={() => setShowPopup(!showPopup)}
            className="flex items-center opacity-90 hover:opacity-100 duration-100 ease-in cursor-pointer bg-green-600 hover:bg-green-700 rounded-full px-3 py-1 text-[13px] text-white"
          >
            Publish
          </button>
        </div>
      </div>
      {showPopup && (
        <SaveStoryPopUp
          storyId={storyId}
          PublishStory={PublishStory}
          setShowPopUp={setShowPopup}
          CurrentUserName={CurrentUserName}
        />
      )}
    </div>
  );
};

export default NavbarStory;

type SaveStoryPopUptypes = {
  storyId: string;
  PublishStory: (topics: string[]) => void;
  setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  CurrentUserName: string | null;
};

const SaveStoryPopUp = ({
  storyId,
  PublishStory,
  setShowPopUp,
  CurrentUserName,
}: SaveStoryPopUptypes) => {
  const [Story, setStory] = useState<any>();
  const [selectedtopics, setSelectedTopics] = useState<string[]>([]);
  useEffect(() => {
    const fetchStoryById = async () => {
      try {
        const result: any = await getStoryById(storyId, false);
        if (result.error) {
          toast({ title: result.error });
        } else {
          const data = await contentFormat(result?.content, 10);
          setStory(data);
        }
      } catch (error) {
        console.log("Error fetching the story data", error);
      }
    };

    fetchStoryById();
  }, []);

  // if (!Story) return null;
  return (
    <div className="fixed bg-gray-50 w-full z-20 overflow-auto top-0 left-0 right-0 bottom-0">
      <span
        onClick={(e) => {
          e.preventDefault();
          setShowPopUp(false);
        }}
        className="absolute top-4 right-6 text-3xl cursor-pointer"
      >
        &times;
      </span>
      <div className="max-w-[900px] mx-auto md:mt-28 mt-10 grid md:grid-cols-2 grid-cols-1 gap-14">
        <div className="max-md:hidden">
          <p className="font-semibold">Story Preview</p>
          <div className="w-full h-[250px] bg-gray-100 rounded my-3 border-b-[1px]">
            {Story?.imgSrc && (
              <Image
                src={Story?.imgSrc}
                width={250}
                height={250}
                alt="Preview Image"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <h1 className="border-b-[1px] text-[18px] font-semibold py-2">
            {Story?.h1elemntwithouttag}
          </h1>
          <p className="border-b-[1px] py-2 text-sm text-neutral-500 pt-3">
            {Story?.firstWords}
          </p>
          <p className="font-medium text-sm pt-2">
            Note:{" "}
            <span className="font-normal text-neutral-500">
              Changes here will affect how your story appears in public places
              like Medium’s homepage and in subscribers’ inboxes — not the
              contents of the story itself.
            </span>
          </p>
        </div>
        <div>
          <p className="py-2">
            Publishing to: <span>{CurrentUserName}</span>
          </p>
          <p className="text-sm pb-3 pt-1 ">
            Add or change topics (up to 5) so readers know what your story is
            about
          </p>
          <Select
            placeholder="tags"
            isMulti
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
            onClick={() => PublishStory(selectedtopics)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white text-sm mt-8"
          >
            Publish now
          </button>
        </div>
      </div>
    </div>
  );
};
