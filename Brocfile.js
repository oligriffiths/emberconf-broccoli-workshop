import funnel from 'broccoli-funnel';
import merge from 'broccoli-merge-trees';
import CompileSass from 'broccoli-sass-source-maps';
import Sass from 'sass';
import Rollup from 'broccoli-rollup';
import LiveReload from 'broccoli-livereload';
import EsLint from 'broccoli-lint-eslint';
import sassLint from 'broccoli-sass-lint';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const compileSass = CompileSass(Sass);

export default (options) => {
  const appRoot = 'src';

  // Copy HTML file from app root to destination
  const html = funnel(appRoot, {
    files: ["index.html"],
    annotation: "Index file",
  });

  let js = EsLint.create(appRoot);

  // Compile JS through rollup
  js = new Rollup(js, {
    inputFiles: ["**/*.js"],
    annotation: "JS Transformation",
    rollup: {
      input: "app.js",
      output: {
        file: "assets/js/app.js",
        format: "iife",
        sourcemap: true,
      },
      plugins: [
        nodeResolve({
          jsnext: true,
          browser: true,
        }),
        commonjs({
          include: 'node_modules/**',
        }),
        babel({
          exclude: "node_modules/**",
        }),
      ],
    }
  });

  // Compile scss files to css
  let css = sassLint(appRoot + '/styles', {
    disableTestGenerator: true,
  });

  css = compileSass(
    [css],
    'app.scss',
    'assets/css/app.css',
    {
      annotation: "Sass files",
      sourceMap: true,
      sourceMapContents: true,
    }
  );

  let tree = merge([html, js, css]);

  // Include live reaload server
  if (options.env === 'development') {
    tree = new LiveReload(tree, {
      target: 'index.html',
    });
  }

  return tree;
}
