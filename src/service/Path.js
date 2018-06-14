export function ViewToRootPath() {
  const muiScript = [].find.bind(mui("script"))(_path => {
    return (/\/(jquery|mui)(\.min)?\.js$/i).test(_path.src);
  });
  let path = "./";
  if (muiScript) {
    path = muiScript.getAttribute("src");
    path = path.replace(/\/js\/(jquery|mui)(\.min)?\.js$/i, "/")
  }
  return path;
}