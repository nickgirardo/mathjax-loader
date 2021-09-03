//@jest-environment node

import compiler from './compiler';

// This is just making sure the test suite is working
test('Returns some program value', async () => {
  const stats = await compiler('example.tex');
  const output = stats.toJson({ source: true }).modules[0].source;

  // We're passing the output of our loader to @svgr/webpack
  // We should expect this to create and return a React svg element
  expect(output).toMatch(/React\.createElement\("svg"/);

  // The last line in the output should export the created element
  // @svgr/webpack calls this element SvgExample
  // I don't like having to hardcode that here as it might change
  expect(output).toMatch(/export default SvgExample;$/);
});

test('Throws an error if options.lang set incorrectly', async () => {
  // LISP is not one of the supported languages :(
  const lang = 'LISP';

  return expect(compiler('example.tex', { lang }))
    .rejects
    .toThrow(`Unexpected value for options.lang: ${lang}`);
});
