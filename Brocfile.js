import funnel from 'broccoli-funnel';
import merge from 'broccoli-merge-trees';

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

  // Copy CSS files from app root to destination
  const css = funnel(appRoot, {
    include: ["**/*.css"],
    srcDir: 'styles',
    destDir: 'assets/css',
    annotation: "CSS files",
  });

  return merge([html, js, css]);
}
