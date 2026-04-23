"use client";

/**
 * PagedEditorCanvas
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a single TipTap EditorContent instance inside a Microsoft Word–style
 * paginated canvas:
 *
 *   • Dark-grey (#525659) workspace background — matches Word / Google Docs
 *   • N white A4/Letter "page sheets" auto-generated from live content height
 *   • Page sheets are absolutely-positioned divs layered BEHIND the content (z-index 0)
 *   • Editor content (z-index 1) flows above the sheets with a transparent bg
 *   • Centred "Page N" label sits inside each sheet's bottom-margin region
 *   • ResizeObserver on `.tiptap` + `editor.on("update")` → live page recalc
 *   • Additional recalc on `window.resize` and `document.fonts.ready`
 *
 * Because it is a single continuous TipTap / ProseMirror instance:
 *   ✅ Cursor tracking across page boundaries
 *   ✅ Seamless text selection spanning pages
 *   ✅ Copy / delete across page breaks
 *   ✅ All existing extensions, bubble menu, floating menu continue to work
 *   ✅ BubbleMenu / FloatingMenu position calculations are unaffected
 */

import { useCallback, useEffect, useRef, useState } from "react";

import type { Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";

// ─── Page geometry constants ──────────────────────────────────────────────────
/** Page width in pixels — matches A4 at 96 dpi. */
export const PAGE_WIDTH = 794;

/** Page height in pixels — matches A4 at 96 dpi. */
export const PAGE_HEIGHT = 1123;

/** Left and right text margin inside each page (≈ 1 in at 96 dpi). */
export const PAGE_MARGIN_X = 96;

/** Top and bottom text margin inside each page (≈ 1 in at 96 dpi). */
export const PAGE_MARGIN_Y = 96;

/** Visible grey gap between consecutive page sheets. */
export const PAGE_GAP = 24;

/**
 * Total vertical slot per page (page height + trailing gap).
 * Page N's top edge sits at: N × PAGE_SLOT.
 */
const PAGE_SLOT = PAGE_HEIGHT + PAGE_GAP; // 1 147 px

// ─── Component ───────────────────────────────────────────────────────────────

interface PagedEditorCanvasProps {
  editor: Editor | null;
}

export function PagedEditorCanvas({ editor }: PagedEditorCanvasProps) {
  const [pageCount, setPageCount] = useState(1);

  /** Wrapper around the EditorContent — used to locate `.tiptap` reliably. */
  const wrapperRef = useRef<HTMLDivElement>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number>(0);

  // ── Compute page count ─────────────────────────────────────────────────────
  /**
   * Reads the `.tiptap` element's scrollHeight (true content height, unaffected
   * by any min-height on ancestor divs) and updates `pageCount`.
   *
   * Wrapped in rAF so multiple rapid updates merge into one paint cycle.
   */
  const recalc = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const tiptap = wrapperRef.current?.querySelector<HTMLElement>(".tiptap");
      if (!tiptap) return;

      // scrollHeight reflects actual rendered content height, not min-height.
      const pages = Math.max(1, Math.ceil(tiptap.scrollHeight / PAGE_SLOT));
      setPageCount(pages);
    });
  }, []);

  // ── Attach ResizeObserver once .tiptap mounts ──────────────────────────────
  useEffect(() => {
    if (!editor) return;

    let attempts = 0;
    const attach = () => {
      const tiptap = wrapperRef.current?.querySelector(".tiptap");
      if (!tiptap) {
        // TipTap renders asynchronously; retry up to 20 times (2 s total).
        if (attempts++ < 20) setTimeout(attach, 100);
        return;
      }
      roRef.current?.disconnect();
      roRef.current = new ResizeObserver(recalc);
      roRef.current.observe(tiptap);
      recalc();
    };

    attach();

    return () => {
      roRef.current?.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [editor, recalc]);

  // ── Recalc on every editor content update ─────────────────────────────────
  useEffect(() => {
    if (!editor) return;
    editor.on("update", recalc);
    return () => {
      editor.off("update", recalc);
    };
  }, [editor, recalc]);

  // ── Recalc on window resize + font load ────────────────────────────────────
  useEffect(() => {
    window.addEventListener("resize", recalc);
    document.fonts?.ready?.then(recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [recalc]);

  // ── Derived ────────────────────────────────────────────────────────────────
  /** Total pixel height of the page column (all sheets + all inter-page gaps). */
  const totalCanvasHeight = pageCount * PAGE_HEIGHT + Math.max(0, pageCount - 1) * PAGE_GAP;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    /* ── Dark workspace background (Shadcn compliant) ── */
    <div
      className="paged-workspace bg-muted/50 dark:bg-zinc-950/50"
      style={{
        width: "100%",
        minHeight: "100%",
        paddingTop: 48,
        paddingBottom: 96,
        boxSizing: "border-box",
      }}
    >
      {/* ── Centred page column ── */}
      <div
        style={{
          position: "relative",
          width: PAGE_WIDTH,
          margin: "0 auto",
          // Reserve enough vertical space for all pages + gaps so the
          // scrollable container grows even before text fills every page.
          minHeight: totalCanvasHeight,
        }}
      >
        {/* ── White page-sheet backgrounds (z-index: 0, pointer-events: none) ── */}
        {Array.from({ length: pageCount }).map((_, idx) => {
          const pageId = `editor-page-${idx + 1}`;
          return (
            <div
              key={pageId}
              id={pageId}
              aria-hidden="true"
              className="absolute left-0 border bg-background shadow-md dark:border-border dark:shadow-none"
              style={{
                top: idx * PAGE_SLOT,
                width: PAGE_WIDTH,
                height: PAGE_HEIGHT,
                borderRadius: "1px",
                zIndex: 0,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {/* ── Page-number footer centred in bottom-margin region ── */}
              <div className="absolute right-0 bottom-8 left-0 flex items-center justify-center font-sans text-[10.5px] text-muted-foreground/60 tracking-widest">
                <span>Page {idx + 1}</span>
              </div>
            </div>
          );
        })}

        {/* ── TipTap content layer (z-index: 1, floats above page sheets) ── */}
        <div
          ref={wrapperRef}
          className="paged-content-layer relative z-10"
          style={{
            /* Horizontal padding defines the text column; vertical padding
               reserves the first page's top margin before text begins. */
            paddingLeft: PAGE_MARGIN_X,
            paddingRight: PAGE_MARGIN_X,
            paddingTop: PAGE_MARGIN_Y,
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
