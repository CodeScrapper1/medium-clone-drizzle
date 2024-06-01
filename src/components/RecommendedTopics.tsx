import Link from "next/link";
import React from "react";

const RecommendedTopics = () => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Recommended topics</h3>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((item, index) => (
          <div
            className="space-y-1 text-sm border bg-gray-200 rounded-full py-2 px-3"
            key={index}
          >
            Data Science
          </div>
        ))}
      </div>
      <Link className="text-green-500 text-xs" href="#">
        See the full list
      </Link>
    </div>
  );
};

export default RecommendedTopics;
