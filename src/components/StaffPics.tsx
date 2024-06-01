import Link from "next/link";
import React from "react";

const StaffPics = () => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Staff Picks</h3>
      <div className="">
        {[1, 2, 3].map((item, index) => (
          <div className="space-y-1 mb-4" key={index}>
            <div className="flex items-center space-x-2">
              <img
                alt="Robert Roy Britt"
                src="./rental.webp"
                className="w-6 h-6 rounded-full"
              />
              <div className="text-xs">
                <span className="font-semibold">Robert Roy Britt</span> in{" "}
                <span className="font-semibold">The Writer’s Guide</span>
              </div>
            </div>
            <h4 className="text-md font-bold">
              The Illusion of Writer’s Block
            </h4>
          </div>
        ))}
      </div>
      <Link className="text-green-500 text-xs" href="#">
        See the full list
      </Link>
    </div>
  );
};

export default StaffPics;
