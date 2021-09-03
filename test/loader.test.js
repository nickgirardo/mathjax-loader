//@jest-environment node

import compiler from './compiler';

// This is just making sure the test suite is working
test('Returns an svg', async () => {
  const stats = await compiler('example.tex');
  const output = stats.toJson({ source: true }).modules[0].source;

  // We're passing the output of our loader to @svgr/webpack
  // We should expect this to create and return a React svg element
  expect(output).toMatch(/React\.createElement\("svg"/);

  // The last line in the output should export the created element
  // @svgr/webpack calls this element Svg${filename}
  // So this below would be called SvgExample
  expect(output).toMatch(/export default Svg.*;$/);
});

test('Throws an error if options.lang set incorrectly', async () => {
  // LISP is not one of the supported languages :(
  const lang = 'LISP';

  return expect(compiler('example.tex', { lang }))
    .rejects
    .toThrow(`Unexpected value for options.lang: ${lang}`);
});

describe('Control sequence behavior', () => {
  test('Cannot find control sequence from package not imported', async () => {
    // Note that the default package list does not include gensymb
    // which is the package which defines \perthousand
    const options = { lang: 'tex' };

    const stats = await compiler('perthousand.tex', options);
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toMatch(/Undefined control sequence/);
  });

  test('Cannot find control sequence from package not imported', async () => {
    // Note that the given packages lacks gensymb
    // which is where the \perthousand control sequence is defined
    const options = { lang: 'tex', packages: ['base', 'ams'] };

    const stats = await compiler('perthousand.tex', options);
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toMatch(/Undefined control sequence/);
  });

  test('Find control sequence from package', async () => {
    // Includes gensymb, this is the package which defined \perthousand
    const options = { lang: 'tex', packages: ['base', 'ams', 'gensymb'] };

    const stats = await compiler('perthousand.tex', options);
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).not.toMatch(/Undefined control sequence/);
  });

  test('Find control sequence using allPackages', async () => {
    const options = { lang: 'tex', allPackages: true };

    const stats = await compiler('perthousand.tex', options);
    const output = stats.toJson({ source: true }).modules[0].source;

    // Checking for this in the output because allPackages includes noundefined
    // A test below describes this behavior
    expect(output).not.toMatch(/fill: "red"/);
  });

  describe('Control sequences which do not exist', () => {
    test('Cannot find a control sequence which doesn\'t exist', async () => {
      const options = { lang: 'tex' };

      const stats = await compiler('garbage.tex', options);
      const output = stats.toJson({ source: true }).modules[0].source;

      expect(output).toMatch(/Undefined control sequence/);
    });

    // If using the package noundefined, the familiar error message
    // "Undefined control sequence \controlsequencename" is not printed
    // Instead the control sequence is rendered in red as its name
    test('Error not thrown with noundefined', async () => {
      const options = { lang: 'tex', packages: ['base', 'noundefined'] };

      const stats = await compiler('garbage.tex', options);
      const output = stats.toJson({ source: true }).modules[0].source;

      expect(output).not.toMatch(/Undefined control sequence/);
      expect(output).toMatch(/fill: "red"/);
    });
  });
});
