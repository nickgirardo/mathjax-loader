//@jest-environment node

import compiler from './compiler';

// This is just making sure the test suite is working
test('Returns an svg', async () => {
  const stats = await compiler('./res/tex/basic.tex');
  const output = stats.toJson({ source: true }).modules[0].source;

  // We're passing the output of our loader to @svgr/webpack
  // We should expect this to create and return a React svg element
  expect(output).toMatch(/React\.createElement\("svg"/);

  // The last line in the output should export the created element
  // @svgr/webpack calls this element Svg${filename}
  // So this below would be called SvgBasic
  expect(output).toMatch(/export default Svg.*;$/);
});

test('Throws an error if options.lang set incorrectly', async () => {
  // LISP is not one of the supported languages :(
  const lang = 'LISP';

  return expect(compiler('./res/tex/basic.tex', { lang }))
    .rejects
    .toThrow(`Unexpected value for options.lang: ${lang}`);
});

describe('Package behavior', () => {
  describe('A control sequence defined outside of the default packages', () => {
    test('Cannot find control sequence from outside of default packages', async () => {
      console.warn = jest.fn();

      // Note that the default package list does not include gensymb
      // which is the package which defines \perthousand
      const options = { lang: 'tex' };

      const stats = await compiler('./res/tex/perthousand.tex', options);
      const output = stats.toJson({ source: true }).modules[0].source;

      expect(output).toMatch(/Undefined control sequence/);
      expect(console.warn).toHaveBeenCalledWith('MathJax: Undefined control sequence \\perthousand');
    });

    test('Cannot find control sequence from package not imported', async () => {
      console.warn = jest.fn();

      // Note that the given packages lacks gensymb
      // which is where the \perthousand control sequence is defined
      const options = { lang: 'tex', packages: ['base', 'ams'] };

      const stats = await compiler('./res/tex/perthousand.tex', options);
      const output = stats.toJson({ source: true }).modules[0].source;

      expect(output).toMatch(/Undefined control sequence/);
      expect(console.warn).toHaveBeenCalledWith('MathJax: Undefined control sequence \\perthousand');
    });

    test('Find control sequence from package', async () => {
      console.warn = jest.fn();

      // Includes gensymb, this is the package which defined \perthousand
      const options = { lang: 'tex', packages: ['base', 'ams', 'gensymb'] };

      const stats = await compiler('./res/tex/perthousand.tex', options);
      const output = stats.toJson({ source: true }).modules[0].source;

      expect(output).not.toMatch(/Undefined control sequence/);
      expect(console.warn).not.toHaveBeenCalled();
    });

    test('Find control sequence using allPackages', async () => {
      console.warn = jest.fn();

      const options = { lang: 'tex', allPackages: true };

      const stats = await compiler('./res/tex/perthousand.tex', options);
      const output = stats.toJson({ source: true }).modules[0].source;

      // Checking for this in the output because allPackages includes noundefined
      // A test below describes this behavior
      expect(output).not.toMatch(/fill: "red"/);
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('A control sequence which does not exist', () => {
    test('Cannot find a control sequence which doesn\'t exist', async () => {
      console.warn = jest.fn();

      const options = { lang: 'tex' };

      const stats = await compiler('./res/tex/garbage.tex', options);
      const output = stats.toJson({ source: true }).modules[0].source;

      expect(output).toMatch(/Undefined control sequence/);
      expect(console.warn).toHaveBeenCalledWith('MathJax: Undefined control sequence \\fakecontrolseq');
    });

    // If using the package noundefined, the familiar error message
    // "Undefined control sequence \controlsequencename" is not printed
    // Instead the control sequence is rendered in red as its name
    test('Error not printed with noundefined', async () => {
      console.warn = jest.fn();

      const options = { lang: 'tex', packages: ['base', 'noundefined'] };

      const stats = await compiler('./res/tex/garbage.tex', options);
      const output = stats.toJson({ source: true }).modules[0].source;

      expect(output).not.toMatch(/Undefined control sequence/);
      expect(output).toMatch(/fill: "red"/);
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('Requesting an unknown package', () => {
    test('Warning printed if undefined package name requested', async () => {
      console.warn = jest.fn();

      const options = { lang: 'tex', packages: ['base', 'made_up_package'] };

      const stats = await compiler('./res/tex/basic.tex', options);
      const output = stats.toJson({ source: true }).modules[0].source;

      expect(console.warn).toHaveBeenCalledWith('Unable to find the package made_up_package');
    });
  });

  test('MathJax errors stop compilation if exitOnError is set', async () => {
      console.warn = jest.fn();

      const options = { lang: 'tex', exitOnError: true };

      const compile = compiler('./res/tex/perthousand.tex', options);

      return expect(compile)
        .rejects
        .toThrow('MathJax: Undefined control sequence \\perthousand');
  });
});
