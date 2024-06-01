"use client";
import { Code, Image, MoreHorizontal, Plus } from "lucide-react";
import { createRoot } from "react-dom/client";
import React, { useEffect, useRef, useState } from "react";
import MediumEditor from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";
import "../lib/new_story.css";
import "highlight.js/styles/github.css";
import { updateStory } from "@/actions/story";
import ImageComp from "./ImageComp";
import Divider from "./Divider";
import CodeBlock from "./CodeBlock";

type Props = {
  storyId: string;
  Storycontent: string | null | undefined;
};

const NewStory = ({ storyId, Storycontent }: Props) => {
  const contentEditabeRef = useRef<HTMLDivElement | null>(null);
  const [openTools, setOpenTools] = useState<boolean>(false);
  const [buttonPosition, setbuttonPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [saving, setSaving] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const debouncedHandleSave = useRef(
    debounce(() => {
      handleSave();
    }, 1000)
  ).current;

  const handleSave = async () => {
    const content = contentEditabeRef.current?.innerHTML;
    setSaving(true);

    try {
      await updateStory({ storyId, content });
      console.log("saved");
    } catch (error) {
      console.log("Error in saving");
    }
    setSaving(false);
  };

  const InserImageComp = () => {
    fileInputRef.current?.click();
  };
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setOpenTools(false);

      const localImageUrl = URL.createObjectURL(file);
      if (typeof window !== "undefined") {
        const wrapperDiv = document.createElement("div");
        const root = createRoot(wrapperDiv);
        root.render(
          <ImageComp
            imageUrl={localImageUrl}
            file={file}
            handleSave={debouncedHandleSave}
          />
        );
        contentEditabeRef.current?.appendChild(wrapperDiv);
      }
    }
  };

  const InserDivider = () => {
    setOpenTools(false);
    if (typeof window !== "undefined") {
      const wrapperDiv = document.createElement("div");
      const root = createRoot(wrapperDiv);
      root.render(<Divider />);
      contentEditabeRef.current?.appendChild(wrapperDiv);
      handleSave();
    }
  };

  const InserCodeBlock = () => {
    setOpenTools(false);
    if (typeof window !== "undefined") {
      const wrapperDiv = document.createElement("div");
      const root = createRoot(wrapperDiv);
      root.render(<CodeBlock handleSave={debouncedHandleSave} />);
      contentEditabeRef.current?.appendChild(wrapperDiv);
    }
  };

  const getCaretPosition = () => {
    let x = 0;
    let y = 0;

    const isSupported = typeof window.getSelection !== "undefined";

    if (isSupported) {
      const selection = window.getSelection() as Selection;
      if (selection?.rangeCount > 0) {
        const range = selection.getRangeAt(0).cloneRange();
        const rect = range.getClientRects()[0];
        if (rect) {
          x = rect.left + window.screenX;
          y = rect.top + window.scrollY - 80;
        }
      }
    }

    return { x, y };
  };

  useEffect(() => {
    const handleInput = () => {
      const { x, y } = getCaretPosition();
      setbuttonPosition({ top: y, left: -50 });

      debouncedHandleSave();
    };

    contentEditabeRef.current?.addEventListener("input", handleInput);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const editor = new MediumEditor(".editable", {
        elementsContainer: document.getElementById("container") as HTMLElement,
        toolbar: {
          buttons: [
            "bold",
            "italic",
            "underline",
            "anchor",
            "h1",
            "h2",
            "h3",
            "quote",
          ],
        },
      });
      return () => {
        editor.destroy();
      };
    }
  }, []);

  return (
    <main
      id="container"
      className="max-w-[800px] mx-auto relative font-mono mt-8"
    >
      <p className="absolute -top-[72px] opacity-30">
        {saving ? "saving..." : "saved"}
      </p>
      <div
        id="editable"
        ref={contentEditabeRef}
        contentEditable
        suppressContentEditableWarning
        className="outline-none focus:outline-none editable max-w-[800px] prose"
        style={{ whiteSpace: "pre-line" }}
      >
        {Storycontent ? (
          <div dangerouslySetInnerHTML={{ __html: Storycontent }}></div>
        ) : (
          <div>
            <h1
              className="font-medium"
              data-h1-placeholder="New Story Title"
            ></h1>
            <p data-p-placeholder="Write your story ..."></p>
          </div>
        )}
      </div>
      <div
        className={`z-10 ${buttonPosition.top === 0 ? "hidden" : ""}`}
        style={{
          position: "absolute",
          top: buttonPosition.top,
          left: buttonPosition.left,
        }}
      >
        <button
          onClick={() => setOpenTools(!openTools)}
          id="tooltip"
          className="border-[1px] border-neutral-500 p-1 rounded-full inline-block"
        >
          <Plus
            className={`duration-300 ease-linear ${
              openTools ? "rotate-90" : ""
            }`}
          />
        </button>
        <div
          id="tool"
          className={`flex items-center space-x-4 absolute top-0 left-14  ${
            openTools ? "visible" : "invisible"
          }`}
        >
          <span
            onClick={InserImageComp}
            className={`border-[1.5px] border-green-500 rounded-full block p-[6px] ${
              openTools ? "scale-100 visible" : "scale-0 invisible"
            } ease-linear duration-100 bg-white cursor-pointer`}
          >
            <Image size={20} className="opacity-60 text-green-800 " />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
          </span>
          <span
            onClick={InserDivider}
            className={`border-[1.5px] border-green-500 rounded-full block p-[6px] ${
              openTools ? "scale-100 visible" : "scale-0 invisible"
            } ease-linear duration-100 delay-75 bg-white cursor-pointer`}
          >
            <MoreHorizontal size={20} className="opacity-60 text-green-800 " />
          </span>
          <span
            onClick={InserCodeBlock}
            className={`border-[1.5px] border-green-500 rounded-full block p-[6px] ${
              openTools ? "scale-100 visible" : "scale-0 invisible"
            } ease-linear duration-100 delay-100 bg-white cursor-pointer`}
          >
            <Code size={20} className="opacity-60 text-green-800 " />
          </span>
        </div>
      </div>
    </main>
  );
};

export default NewStory;
