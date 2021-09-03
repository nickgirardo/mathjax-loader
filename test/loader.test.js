//@jest-environment node

import compiler from './compiler';

// This is just making sure the test suite is working
test('Returns some program value', async () => {
  const stats = await compiler('example.tex');
  const output = stats.toJson({ source: true }).modules[0].source;

  expect(output).toBe('export default "x_1";');
});

test('Throws an error if options.lang set incorrectly', async () => {
  // LISP is not one of the supported languages :(
  const lang = 'LISP';

  return expect(compiler('example.tex', { lang }))
    .rejects
    .toThrow(`Unexpected value for options.lang: ${lang}`);
});
