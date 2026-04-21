import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export function useChatScroll(chatRef: React.RefObject<HTMLDivElement | null>, messagesLength: number) {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasUnreadDownBelow, setHasUnreadDownBelow] = useState(false);
  const hasInitialScrolled = useRef(false);

  const lastScrollHeight = useRef<number>(0);
  const isFetchingOlder = useRef<boolean>(false);

  // Safely grab Shadcn's scrollable viewport directly from the forwarded ref
  const getViewport = useCallback(() => chatRef.current as HTMLElement | null, [chatRef.current]);
  useEffect(() => {
    const viewport = getViewport();

    if (!viewport) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      // 100px threshold allows forgiveness for smooth scrolling animations
      const atBottom = scrollHeight - scrollTop - clientHeight < 100;

      setIsAtBottom(atBottom);
      if (atBottom) {
        setHasUnreadDownBelow(false);
      }
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [getViewport]);

  const scrollToBottom = useCallback(
    (smooth = true) => {
      const viewport = getViewport();
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: smooth ? "smooth" : "auto" });
        setIsAtBottom(true);
        setHasUnreadDownBelow(false);
      }
    },
    [getViewport],
  );

  const snapshotScrollBeforeFetch = useCallback(() => {
    const viewport = getViewport();
    if (viewport) {
      lastScrollHeight.current = viewport.scrollHeight;
      isFetchingOlder.current = true;
    }
  }, [getViewport]);

  useLayoutEffect(() => {
    const viewport = getViewport();
    if (!viewport) return;

    // 1. Initial Load
    if (!hasInitialScrolled.current && messagesLength > 0) {
      viewport.scrollTop = viewport.scrollHeight;
      hasInitialScrolled.current = true;
      return;
    }

    // 2. Render finish following a pagination block (maintains viewport perfectly mapped against new older items)
    if (isFetchingOlder.current) {
      viewport.scrollTop = viewport.scrollTop + (viewport.scrollHeight - lastScrollHeight.current);
      isFetchingOlder.current = false;
      return;
    }

    // 3. New incoming message arrived down the socket
    if (hasInitialScrolled.current) {
      if (isAtBottom) {
        viewport.scrollTop = viewport.scrollHeight;
      } else {
        // User is scrolled up and a message arrives
        setHasUnreadDownBelow(true);
      }
    }
  }, [messagesLength, isAtBottom, getViewport]); // Intentionally omitting others to bind just to array size and position changes

  return {
    isAtBottom,
    hasUnreadDownBelow,
    scrollToBottom,
    snapshotScrollBeforeFetch,
  };
}
