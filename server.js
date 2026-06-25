const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

const rewrites = new Map([
  ["/main", "main.html"],
  ["/client-gallery", "client-gallery.html"],
  ["/featured-stories", "featured-stories.html"],
  ["/stories/bharat-mehak", "featured-story-bharat-mehak.html"],
  ["/stories/meera-arjun", "featured-story-meera-arjun.html"]
]);

function rewritePath(urlPath) {
  if (urlPath === "/admin" || urlPath.startsWith("/admin/")) return "admin.html";
  return rewrites.get(urlPath) || null;
}

function safePath(urlPath) {
  const cleanUrl = decodeURIComponent(urlPath.split("?")[0]);
  const rewritten = rewritePath(cleanUrl);
  const cleanPath = (rewritten || cleanUrl).replace(/^\/+/, "");
  const resolved = path.resolve(root, cleanPath || "index.html");
  return resolved.startsWith(root) ? resolved : path.join(root, "index.html");
}

const server = http.createServer((req, res) => {
  let filePath = safePath(req.url || "/");
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  const type = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log(`ROOH N RANG frontend running at http://${host}:${port}`);
});