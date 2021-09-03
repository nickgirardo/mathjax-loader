import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';

import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';

import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';

const defaultOptions = {
  lang: 'TeX',
  packages: ['base', 'ams'],
  allPackages: false,
};

export function loadTeX(source, userOptions) {
  const options = { ...defaultOptions, ...userOptions };

  // If we are told to include all packages, ignore the packages arg and use all
  const packages = options.allPackages ? AllPackages : options.packages;

  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);
  // TODO take packages from options
  const tex = new TeX({ packages });
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

