import { useState } from "react";

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState<string | null>(null);

  const copy = async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setIsCopied(text);
      } else {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setIsCopied(text);
      }

      setTimeout(() => {
        setIsCopied(null);
      }, 1500);
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard", error);
      setIsCopied(null);
      return false;
    }
  };

  return { isCopied, copy };
}
