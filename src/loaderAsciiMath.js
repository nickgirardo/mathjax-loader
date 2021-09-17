import { mathjax } from 'mathjax-full/js/mathjax';
import { AsciiMath } from 'mathjax-full/js/input/asciimath';
import { SVG } from 'mathjax-full/js/output/svg';

import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';

const defaultOptions = {
  lang: 'AsciiMath',
};

export function loadAsciiMath(source, userOptions) {
  const options = { ...defaultOptions, ...userOptions };

  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);

  const asciiMath = new AsciiMath({});
  const svg = new SVG({ fontCache: 'none' });

  const asciiMathDoc = mathjax.document('', {
    InputJax: asciiMath,
    OutputJax: svg,
  });

  const node = asciiMathDoc.convert(source.trim(), {
    display: true,
  });

  return adaptor.innerHTML(node);
}
