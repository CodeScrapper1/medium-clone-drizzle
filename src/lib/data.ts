export const topics = [
  { value: "Javascript", label: "Javascript" },
  { value: "Python", label: "Python" },
  { value: "Programming", label: "Programming" },
  { value: "Fashion", label: "Fashion" },
  { value: "World", label: "World" },
  { value: "Politics", label: "Politics" },
];

export const contentFormat = async (content: string, words: number) => {
  const stripHtmlTags = (htmlString: string) => {
    return htmlString?.replace(/<[^>]*>/g, "");
  };

  const contentWithoutH1 = content?.replace(/<h1[^>]*>[\s\S]*?<\/h1>/g, "");
  const finalSanitizedContent = contentWithoutH1?.replace(
    /<h1[^>]*>[\s\S]*?<\/h1>|<select[^>]*>[\s\S]*?<\/select>|<textarea[^>]*>[\s\S]*?<\/textarea>/gi,
    ""
  );

  const textWithoutHtml = stripHtmlTags(contentWithoutH1);

  const firstWords = textWithoutHtml?.split(/\s+/)?.slice(0, words)?.join(" ");

  // H1 tag for heading

  const h1match = content?.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const h1elemntwithouttag = h1match ? stripHtmlTags(h1match[1]) : "";

  // imgage Src for Image preview

  const ImageMatch = content?.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/);

  const imgSrc = ImageMatch ? ImageMatch[1] : "";
  return {
    h1elemntwithouttag,
    textWithoutHtml,
    finalSanitizedContent,
    firstWords,
    imgSrc,
  };
};
