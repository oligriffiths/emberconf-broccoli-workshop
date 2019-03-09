import funnel from 'broccoli-funnel';
import merge from 'broccoli-merge-trees';
import CompileSass from 'broccoli-sass-source-maps';
import Sass from 'sass';
import babel from 'broccoli-babel-transpiler';

const compileSass = CompileSass(Sass);

export default () => {
  const appRoot = 'src';

  // Copy HTML file from app root to destination
  const html = funnel(appRoot, {
    files: ["index.html"],
    annotation: "Index file",
  });

  // Copy JS files from app root to destination
  let js = funnel(appRoot, {
    include: ["**/*.js"],
    destDir: 'assets/js',
    annotation: "JS files",
  });

  // Transpile JS files to ES5
  js = babel(js, {
    browserPolyfill: true,
    sourceMap: 'inline',
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

  return merge([html, js, css]);
}
