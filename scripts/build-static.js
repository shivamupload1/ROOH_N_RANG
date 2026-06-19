const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const entries = ["index.html", "main.html", "client-gallery.html", "featured-stories.html", "featured-story-bharat-mehak.html", "featured-story-meera-arjun.html", "css", "js", "assets"];

function removeIfExists(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function copyEntry(entry) {
  const source = path.join(root, entry);
  const target = path.join(dist, entry);
  const stats = fs.statSync(source);
  if (stats.isDirectory()) {
    fs.cpSync(source, target, { recursive: true });
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

removeIfExists(dist);
fs.mkdirSync(dist, { recursive: true });
entries.forEach(copyEntry);
console.log(`Static site built in ${dist}`);