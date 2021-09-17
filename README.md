mathjax-loader
==============

Use [MathJax](https://mathjax.org/) to import TeX and MathML files as SVGs.

Usage
-----

To get started, install `mathjax-loader` 

```console
npm install --save-dev mathjax-loader
```

`mathjax-loader` outputs as SVG files, it is therefore recommended to combine it with another loader such as [`@svgr/webpack`](https://www.npmjs.com/package/@svgr/webpack).

An example setup might look something like this:

**webpack.config.js**
```js
module.exports = {
    module: {
        rules: [
            {
              test: /\.tex$/,
              use: [
                '@svgr/webpack',
                {
                  loader: 'mathjax-loader',
                  options: { lang: 'TeX' },
                },
              ],
            },
            {
              test: /\.mml$/,
              use: [
                '@svgr/webpack',
                {
                  loader: 'mathjax-loader',
                  options: { lang: 'MathML' },
                },
              ],
            },
            {
              test: /\.asciimath$/,
              use: [
                '@svgr/webpack',
                {
                  loader: 'mathjax-loader',
                  options: { lang: 'AsciiMath' },
                },
              ],
            },
        ],
    },
};
```

Which should be able to load the following files:

**euler.tex**
```tex
e^{i\theta{}} = \cos{\theta{}} + i\sin{\theta{}}
```

**pythagoras.mml**
```xml
<math>
  <mrow>
    <msup>
      <mi>&nbsp; a </mi>
      <mn>2</mn>
    </msup>
    <mo> + </mo>
    <msup>
      <mi> b </mi>
      <mn>2</mn>
    </msup>
    <mo> = </mo>
    <msup>
      <mi> c </mi>
      <mn>2</mn>
    </msup>
  </mrow>
</math>
```

**trig.asciimath**
```
sin^2 theta + cos^2 theta = 1
```

With this they can be included into a react document.  Note that `@svgr/webpack` is critical for this.

**example.jsx**
```jsx
import Euler from 'euler.tex';
import Pythagoras from 'pythagoras.mml';
import Trig from 'trig.asciimath';

export default Example = () => (
  <>
    <div><Euler /></div>
    <div><Pythagoras /></div>
    <div><Trig /></div>
  </>
);
```

Options
-------

|  Name         |  Values                            |  Default          |  Description                           |
|---------------|------------------------------------|-------------------|----------------------------------------|
| `lang`        | `"TeX"`, `"MathML"`, `"AsciiMath"` | `TeX`             | Language of the input file             |
| `packages`    | `Array<string>`                    | `['base', 'ams']` | TeX only: which packages to use        |
| `allPackages` | `boolean`                          | `false`           | TeX only: should all packages be used  |
| `exitOnError` | `boolean`                          | `false`           | TeX only: exit if error in typesetting |

### lang

This loader can handle TeX, MathML, and AsciiMath files.  The `lang` option sets which language should be used.  Case insensitive.

### packages

This option is only used for TeX files.  This option sets which packages should be included.  Not all TeX packages are available.  Check here for list of [MathJax supported packages](http://docs.mathjax.org/en/latest/input/tex/extensions/index.html).

The packages `base` and [`ams`](http://docs.mathjax.org/en/latest/input/tex/extensions/ams.html) are included by default.  It is highly recommended to include `base`.

### allPackages

This option is only used for TeX files.  If this option is set, all of the available TeX packages are used.

If this option is set to `true`, the `packages` option is ignored.

### exitOnError

This option is only used for TeX files.  Generally, MathJax will still output valid files if TeX errors are present.  If you would instead not want files with TeX errors to compile, set this option to `true`.

Note that some packages may catch errors and handle them themselves.  For instance, using an undefined control sequence will cause a TeX error, but only if `noundefined` is not included.  If `noundefined` is included it will catch the undefined control sequence and output it as a raw string in red.
