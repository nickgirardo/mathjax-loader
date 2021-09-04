import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';

import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';

import { STATE } from 'mathjax-full/js/core/MathItem';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';

const defaultOptions = {
  lang: 'TeX',
  packages: ['base', 'ams'],
  allPackages: false,
  exitOnError: false,
};


export function loadTeX(source, userOptions) {
  function checkError(math) {
    const { root, typesetRoot } = math;
    if (!root.toString().startsWith('math([merror(['))
      return;

    const merror = root.childNodes[0].childNodes[0];
    const text = merror.attributes.get('data-mjx-error') || merror.childNodes[0].childNodes[0].getText();

    const error = `MathJax: ${text}`;

    // Should we throw and stop the compilation on errors?
    if (options.exitOnError)
      throw new Error(error);

    // If not, just warn the user
    console.warn(error);
  }

  const options = { ...defaultOptions, ...userOptions };

  // If we are told to include all packages, ignore the packages arg and use all
  const packages = options.allPackages ? AllPackages : options.packages;

  // Warn the user if any of the requested packages cannot be found
  packages
    .filter(p => !AllPackages.includes(p))
    .forEach(p => console.warn(`Unable to find the package ${p}`));

  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);
  // TODO take packages from options
  const tex = new TeX({ packages });
  const svg = new SVG({ fontCache: 'none' });

  const checkForErrors = [STATE.TYPESET, null, checkError];
  const texDoc = mathjax.document('', {
    InputJax: tex,
    OutputJax: svg,
    renderActions: { checkForErrors },
  });

  const node = texDoc.convert(source.trim(), {
    display: true,
  });

  return adaptor.innerHTML(node);
}

