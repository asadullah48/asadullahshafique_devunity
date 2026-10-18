import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFrontmatter } from '../src/lib/frontmatter.ts';

test('preserves article metadata and Markdown body', () => {
  const result = readFrontmatter('---\ntitle: "A: title"\ndate: 2026-10-18\ntags: [AI, MCP]\nexcerpt: |\n  First line\n  Second line\n---\n# Body\n---\nMore\n');
  assert.equal(result.data.title, 'A: title');
  assert.equal(result.data.date, '2026-10-18');
  assert.deepEqual(result.data.tags, ['AI', 'MCP']);
  assert.equal(result.data.excerpt, 'First line\nSecond line\n');
  assert.equal(result.content, '# Body\n---\nMore\n');
});

test('accepts BOM, Windows newlines, Arabic and empty metadata', () => {
  assert.deepEqual(readFrontmatter('\uFEFF---\r\ntitle: مرحبا\r\n---\r\nBody'), { data: { title: 'مرحبا' }, content: 'Body' });
  assert.deepEqual(readFrontmatter('---\n\n---\nBody'), { data: {}, content: 'Body' });
});

test('leaves Markdown without a metadata block unchanged', () => {
  assert.deepEqual(readFrontmatter('# Body\n---\n'), { data: {}, content: '# Body\n---\n' });
});

test('rejects invalid YAML and non-mapping metadata', () => {
  assert.throws(() => readFrontmatter('---\ntitle: [\n---\n'));
  assert.throws(() => readFrontmatter('---\n- item\n---\n'), /mapping/);
});
