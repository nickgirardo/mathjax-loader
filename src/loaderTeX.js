import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';

import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

export function loadTeX(source, options) {
  // TODO take packages from options
  const tex = new TeX({ packages: ['base', 'ams'] });
  const svg = new SVG({ fontCache: 'none' });

  const texDoc = mathjax.document('', {
    InputJax: tex,
    OutputJax: svg,
  });

  const node = texDoc.convert(source.trim(), {
    display: true,
  });

  return adaptor.innerHTML(node);
}

