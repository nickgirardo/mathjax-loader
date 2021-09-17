import { getOptions } from 'loader-utils';

import { loadTeX } from './loaderTeX.js';
import { loadMathML } from './loaderMathML.js';
import { loadAsciiMath } from './loaderAsciiMath.js';

export default function (source) {
  const options = getOptions(this);

  const lang = (options.lang ?? 'TeX').toLowerCase();

  switch (lang) {
    case 'tex':
      return loadTeX(source, options);
    case 'mathml':
      return loadMathML(source, options);
    case 'asciimath':
      return loadAsciiMath(source, options);
    default:
      // NOTE using options.lang instead of lang here to preserve capitalization
      throw new Error(`Unexpected value for options.lang: ${options.lang}.`);
  }
}
