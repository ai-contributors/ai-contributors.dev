export const CUSTOM_DOMAIN = 'https://ai-contributors.dev';
export const PRODUCTION_BASE = '/ai-contributor-spec/';
export const PRODUCTION_DIR = 'ai-contributor-spec';
export const PREVIEW_BASE = '/pr-preview/';

export function productionUrl(path = '') {
  const normalizedPath = path.replace(/^\/+/, '');
  return new URL(`${PRODUCTION_BASE}${normalizedPath}`, CUSTOM_DOMAIN).toString();
}

export function previewBaseForPr(prNumber) {
  if (!Number.isInteger(Number(prNumber)) || Number(prNumber) < 1) {
    throw new Error(`Invalid pull request number: ${prNumber}`);
  }

  return `${PREVIEW_BASE}pr-${prNumber}/`;
}

export function productionRedirectHtml() {
  const target = PRODUCTION_BASE;
  const canonical = productionUrl();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=${target}">
    <link rel="canonical" href="${canonical}">
    <title>AI Contributor Spec</title>
  </head>
  <body>
    <p><a href="${target}">Continue to AI Contributor Spec</a></p>
  </body>
</html>
`;
}
