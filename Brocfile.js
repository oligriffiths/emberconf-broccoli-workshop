import funnel from 'broccoli-funnel';
import merge from 'broccoli-merge-trees';
import CompileSass from 'broccoli-sass-source-maps';
import Sass from 'sass';
import Rollup from 'broccoli-rollup';
import LiveReload from 'broccoli-livereload';
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

  // Compile JS through rollup
  let js = new Rollup(appRoot, {
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
  const css = compileSass(
    [appRoot],
    'styles/app.scss',
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
