import { mathjax } from 'mathjax-full/js/mathjax';
import { MathML } from 'mathjax-full/js/input/mathml';
import { SVG } from 'mathjax-full/js/output/svg';

import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';

const defaultOptions = {
  lang: 'MathML',
};

export function loadMathML(source, userOptions) {
  const options = { ...defaultOptions, ...userOptions };

  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);

  const mathml = new MathML({});
  const svg = new SVG({ fontCache: 'none' });

  const mathmlDoc = mathjax.document('', {
    InputJax: mathml,
    OutputJax: svg,
  });

  const node = mathmlDoc.convert(source.trim(), {
    display: true,
  });

  return adaptor.innerHTML(node);
}
