import { Extension } from "@tiptap/react";
import "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

export const LineHeight = Extension.create({
  name: "lineHeight",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
      defaultLineHeight: "1.0",
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: (element) => {
              const lineHeight = element.style.lineHeight;
              if (lineHeight) {
                // Convert pixel values to multipliers if needed
                const numericValue = parseFloat(lineHeight);
                if (!Number.isNaN(numericValue)) {
                  // If it's a pixel value, assume base font-size of 16px and convert to multiplier
                  if (lineHeight.includes("px")) {
                    return (numericValue / 16).toString();
                  }
                  // If it's already a number/multiplier, return as string
                  return numericValue.toString();
                }
              }
              return this.options.defaultLineHeight;
            },
            renderHTML: (attributes) => {
              if (!attributes.lineHeight || attributes.lineHeight === this.options.defaultLineHeight) {
                return {};
              }

              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ editor }) => {
          // Get the current selection
          const { from, to } = editor.state.selection;

          // If there's a selection, apply to all nodes in selection
          if (from !== to) {
            editor.state.doc.nodesBetween(from, to, (node, pos) => {
              if (this.options.types.includes(node.type.name)) {
                editor.view.dispatch(editor.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, lineHeight }));
              }
            });
            return true;
          }

          // Otherwise, apply to current paragraph/heading at cursor
          const resolvedPos = editor.state.doc.resolve(from);
          let depth = resolvedPos.depth;

          // Find the nearest paragraph or heading
          while (depth > 0) {
            const node = resolvedPos.node(depth);
            if (this.options.types.includes(node.type.name)) {
              editor.view.dispatch(
                editor.state.tr.setNodeMarkup(resolvedPos.before(depth), undefined, { ...node.attrs, lineHeight }),
              );
              return true;
            }
            depth--;
          }

          return false;
        },

      unsetLineHeight:
        () =>
        ({ commands }) => {
          const lineHeight = this.options.defaultLineHeight;
          return commands.setLineHeight(lineHeight);
        },
    };
  },
});
