const KEYWORD_RE = /\b(MUST NOT|SHOULD NOT|MUST|SHOULD|MAY)\b/g;

const KEYWORD_CLASS: Record<string, string> = {
  'MUST NOT': 'w-must',
  MUST: 'w-must',
  'SHOULD NOT': 'w-should',
  SHOULD: 'w-should',
  MAY: 'w-may',
};

export function highlightWeight(text: string): string {
  return text.replace(KEYWORD_RE, (keyword) => {
    return `<em class="${KEYWORD_CLASS[keyword]}">${keyword}</em>`;
  });
}
