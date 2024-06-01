import { MoreHorizontal } from "lucide-react";

const Divider = () => {
  return (
    <div className="py-3 w-full">
      <div
        className="text-center flex items-center justify-center "
        contentEditable={false}
      >
        <MoreHorizontal size={32} />
      </div>
      <p data-p-placeholder="Write your text ..."></p>
    </div>
  );
};

export default Divider;
