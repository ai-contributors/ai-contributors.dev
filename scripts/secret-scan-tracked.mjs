import { execFileSync, spawnSync } from 'node:child_process';

const ignoredPrefixes = [
  '.ai-contributor-audit/',
  'docs/superpowers/',
  'external/',
  'src/content/docs/generated-spec/',
];
const ignoredFiles = new Set(['AI-CONTRIBUTOR-AUDIT.md']);

const trackedFiles = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)
  .filter((file) => !ignoredFiles.has(file))
  .filter((file) => !ignoredPrefixes.some((prefix) => file.startsWith(prefix)));

if (trackedFiles.length === 0) {
  process.exit(0);
}

const secretlint = process.platform === 'win32' ? 'secretlint.cmd' : 'secretlint';
const result = spawnSync(secretlint, ['--secretlintrc', '.secretlintrc.json', ...trackedFiles], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
