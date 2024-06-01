"use client";
import { useEffect, useState } from "react";
import { ImageUpload } from "@/lib/cloudinary";

const ImageComp = ({
  imageUrl,
  file,
  handleSave,
}: {
  imageUrl: string;
  file: File;
  handleSave: () => void;
}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(imageUrl);

  const updateImageUrl = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await ImageUpload(formData).then((SecureImageUrl: any) =>
        setCurrentImageUrl(SecureImageUrl)
      );
    } catch (error) {
      console.log("Error uplaoding the image", error);
    }
  };

  useEffect(() => {
    updateImageUrl().then(() => {
      handleSave();
    });
  }, [imageUrl]);
  return (
    <div className="py-3">
      <div>
        <img
          src={currentImageUrl}
          alt="Image"
          className="max-w-full h-[450px]"
        />
        <div className="text-center text-sm max-w-md mx-auto">
          <p data-p-placeholder="Type caption for your image"></p>
        </div>
      </div>
      <p data-p-placeholder="..."></p>
    </div>
  );
};
export default ImageComp;
