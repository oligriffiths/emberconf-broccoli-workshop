import funnel from 'broccoli-funnel';
import merge from 'broccoli-merge-trees';
import CompileSass from 'broccoli-sass-source-maps';
import Sass from 'sass';

const compileSass = CompileSass(Sass);

export default () => {
  const appRoot = 'src';

  // Copy HTML file from app root to destination
  const html = funnel(appRoot, {
    files: ["index.html"],
    annotation: "Index file",
  });

  // Copy JS files from app root to destination
  const js = funnel(appRoot, {
    include: ["**/*.js"],
    destDir: 'assets/js',
    annotation: "JS files",
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
