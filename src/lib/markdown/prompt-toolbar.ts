// Remark plugin: turns the upstream `:::prompt{title="…" lines="…"
// download="…"}` container directive into a `<div class="dx-prompt">`
// wrapping a `<div class="dx-prompt-toolbar">` plus the directive's
// children. Pairs with U9 upstream — the audit-prompt MD declares the
// directive; this plugin re-injects the toolbar at build time so the
// page does not need to carry it as page-level HTML.

import { visit } from 'unist-util-visit';

interface MdastNode {
  type: string;
  name?: string;
  attributes?: Record<string, string>;
  children?: MdastNode[];
  data?: { hName?: string; hProperties?: Record<string, unknown> };
  value?: string;
}

function el(
  tagName: string,
  properties: Record<string, unknown>,
  children: MdastNode[] = [],
): MdastNode {
  return {
    type: 'element',
    data: { hName: tagName, hProperties: properties },
    children,
  } as MdastNode;
}

function text(value: string): MdastNode {
  return { type: 'text', value };
}

export default function remarkPromptDirective() {
  return (tree: MdastNode) => {
    visit(tree, (node) => {
      if (node.type !== 'containerDirective' || node.name !== 'prompt') return;
      const attrs = node.attributes ?? {};
      const title = attrs.title ?? 'Prompt';
      const lines = attrs.lines ?? '';
      const download = attrs.download ?? 'prompt.txt';

      const toolbarChildren: MdastNode[] = [
        el('span', { className: ['dx-prompt-title'] }, [text(title)]),
      ];
      if (lines) {
        toolbarChildren.push(
          el('span', { className: ['dx-prompt-lines'] }, [text(`${lines} lines`)]),
        );
      }
      toolbarChildren.push(
        el('button', { type: 'button', className: ['dx-prompt-copy'], 'data-prompt-copy': '' }, [
          text('Copy'),
        ]),
      );
      toolbarChildren.push(
        el(
          'a',
          {
            className: ['dx-prompt-download'],
            download,
            'data-prompt-download': '',
            href: '#',
          },
          [text('Download .txt')],
        ),
      );

      const toolbar = el('div', { className: ['dx-prompt-toolbar'] }, toolbarChildren);
      const wrapper = el('div', { className: ['dx-prompt'] }, [toolbar, ...(node.children ?? [])]);

      // Mutate in place into the wrapper element.
      Object.assign(node, wrapper);
    });
  };
}
