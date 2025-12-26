import Link from "next/link";
import React from "react";

export function linkifyText(text: string): React.ReactNode {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <Link
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-4  hover:underline"
        >
          {part}
        </Link>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
