const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
let heroIndex = 0;

function showHeroSlide(index) {
  if (!heroSlides.length) return;
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });
}

if (heroSlides.length) {
  setInterval(() => {
    heroIndex = (heroIndex + 1) % heroSlides.length;
    showHeroSlide(heroIndex);
  }, 3600);
}

const header = document.getElementById("site-header");
if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

const menuOpenButtons = document.querySelectorAll("[data-menu-open]");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
menuOpenButtons.forEach((button) => button.addEventListener("click", () => {
  document.body.classList.remove("login-open");
  document.body.classList.add("menu-open");
}));
menuCloseButtons.forEach((button) => button.addEventListener("click", () => document.body.classList.remove("menu-open")));

const CLIENT_GALLERY_ACCESS_KEY = "roohClientGalleryAccess";
let loginDrawerReady = false;

function ensureLoginDrawer() {
  if (loginDrawerReady || document.querySelector("[data-login-drawer]")) return;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="login-overlay" data-login-close aria-hidden="true"></div>
    <aside class="login-drawer" data-login-drawer data-auth-mode="login" role="dialog" aria-modal="true" aria-label="Rooh N Rang login">
      <button class="login-drawer__close icon-button" type="button" data-login-close aria-label="Close login">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
      <section class="login-drawer__panel">
        <div class="login-drawer__brand">
          <span>ROOH N RANG</span>
          <h2 data-login-title>Login</h2>
          <p>Private gallery access, studio updates and future Supabase Auth will live here.</p>
        </div>
        <div class="login-drawer__switch" aria-label="Authentication mode">
          <button type="button" class="is-active" data-login-mode="login" aria-pressed="true">Login</button>
          <button type="button" data-login-mode="signup" aria-pressed="false">Signup</button>
        </div>
        <form class="login-drawer__form" data-login-form>
          <label class="login-drawer__field login-drawer__field--signup">
            <span>Name</span>
            <input type="text" placeholder="Your name" autocomplete="name">
          </label>
          <label class="login-drawer__field">
            <span>Email</span>
            <input type="email" placeholder="name@example.com" autocomplete="email" data-login-email required>
          </label>
          <label class="login-drawer__field">
            <span>Password</span>
            <input type="password" placeholder="Gallery password" autocomplete="current-password" data-login-password required>
          </label>
          <button class="login-drawer__submit" type="submit" data-login-submit>Continue</button>
          <p class="login-drawer__error" data-login-error hidden>Details match nahi ho rahe. Please email aur password check karein.</p>
        </form>
        <p class="login-drawer__note">Preview login only. Final protected galleries will move to Supabase.</p>
      </section>
    </aside>
  `);

  document.querySelectorAll("[data-login-close]").forEach((button) => {
    button.addEventListener("click", closeLoginDrawer);
  });

  document.querySelectorAll("[data-login-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-login-mode") || "login";
      const drawer = document.querySelector("[data-login-drawer]");
      const title = document.querySelector("[data-login-title]");
      const submit = document.querySelector("[data-login-submit]");
      drawer?.setAttribute("data-auth-mode", mode);
      document.querySelectorAll("[data-login-mode]").forEach((item) => {
        const active = item.getAttribute("data-login-mode") === mode;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });
      if (title) title.textContent = mode === "signup" ? "Signup" : "Login";
      if (submit) submit.textContent = mode === "signup" ? "Create Account" : "Continue";
      const error = document.querySelector("[data-login-error]");
      if (error) error.hidden = true;
    });
  });

  document.querySelector("[data-login-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.querySelector("[data-login-email]")?.value.trim() || "";
    const password = form.querySelector("[data-login-password]")?.value || "";
    const error = form.querySelector("[data-login-error]");

    if (error) error.hidden = true;
    form.classList.remove("has-error");

    if (!email || !password) {
      if (error) {
        error.textContent = "Preview ke liye email aur password dono fill karein.";
        error.hidden = false;
      }
      form.classList.add("has-error");
      return;
    }

    window.location.href = "/client-login";
  });

  loginDrawerReady = true;
}

function openLoginDrawer(event) {
  event?.preventDefault();
  ensureLoginDrawer();
  document.body.classList.remove("menu-open");
  window.requestAnimationFrame(() => document.body.classList.add("login-open"));
}

function closeLoginDrawer() {
  document.body.classList.remove("login-open");
}

document.querySelectorAll("[aria-label='Login'], [data-login-open]").forEach((button) => {
  button.addEventListener("click", openLoginDrawer);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.body.classList.remove("menu-open", "login-open", "lightbox-open");
  }
});

if (window.location.hash === "#login") {
  window.setTimeout(openLoginDrawer, 80);
}

if (window.location.hash === "#menu") {
  window.setTimeout(() => {
    document.body.classList.remove("login-open");
    document.body.classList.add("menu-open");
  }, 80);
}

if (document.body.classList.contains("gallery-body") && window.sessionStorage.getItem(CLIENT_GALLERY_ACCESS_KEY) !== "true") {
  window.location.replace("main.html#login");
}

const featureImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=3000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=3000&auto=format&fit=crop"
];
const featureFrame = document.querySelector(".feature-frame");
const featureImage = document.getElementById("feature-image");
const dotsContainer = document.getElementById("slide-dots");
let featureIndex = 0;

function renderDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = "";
  featureImages.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = index === featureIndex ? "is-active" : "";
    dotsContainer.appendChild(dot);
  });
}

function setFeatureImage(index) {
  if (!featureImage || !featureFrame) return;
  featureIndex = (index + featureImages.length) % featureImages.length;
  featureFrame.classList.add("is-changing");
  window.setTimeout(() => {
    featureImage.src = featureImages[featureIndex];
    renderDots();
    featureImage.onload = () => featureFrame.classList.remove("is-changing");
  }, 180);
}

document.querySelectorAll("[data-slide]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.getAttribute("data-slide");
    setFeatureImage(featureIndex + (direction === "next" ? 1 : -1));
  });
});
renderDots();

const video = document.getElementById("story-video");
const videoProgress = document.getElementById("video-progress-bar");
if (video && videoProgress) {
  video.addEventListener("timeupdate", () => {
    const percent = video.duration ? (video.currentTime / video.duration) * 100 : 0;
    videoProgress.style.width = `${percent}%`;
  });
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const tile = event.target.closest("[data-lightbox]");
  if (!tile || !lightbox || !lightboxImage) return;
  lightboxImage.src = tile.getAttribute("data-lightbox") || "";
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
});

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("lightbox-open");
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    document.body.classList.remove("menu-open");
  }
});

const filterButtons = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll(".client-tile");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    galleryItems.forEach((item) => {
      const shouldShow = filter === "all" || item.classList.contains(filter || "");
      item.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

document.querySelectorAll("[data-like]").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("is-liked");
  });
});

const mainHeroImages = [
  "assets/main-slideshow/main-slide-01.jpg",
  "assets/main-slideshow/main-slide-02.jpg",
  "assets/main-slideshow/main-slide-03.jpg",
  "assets/main-slideshow/main-slide-04.jpg",
  "assets/main-slideshow/main-slide-05.jpg",
  "assets/main-slideshow/main-slide-06.jpg",
  "assets/main-slideshow/main-slide-07.jpg",
  "assets/main-slideshow/main-slide-08.jpg",
  "assets/main-slideshow/main-slide-09.jpg",
  "assets/main-slideshow/main-slide-10.jpg"
];
const mainHero = document.querySelector(".story-hero");
const mainHeroImage = document.getElementById("main-hero-image");
const mainHeroDots = document.getElementById("main-hero-dots");
let mainHeroIndex = 0;

function renderMainHeroDots() {
  if (!mainHeroDots) return;
  mainHeroDots.innerHTML = "";
  mainHeroImages.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = index === mainHeroIndex ? "is-active" : "";
    mainHeroDots.appendChild(dot);
  });
}

function setMainHeroImage(index) {
  if (!mainHero || !mainHeroImage) return;
  mainHeroIndex = (index + mainHeroImages.length) % mainHeroImages.length;
  mainHero.classList.add("is-changing");
  window.setTimeout(() => {
    mainHeroImage.src = mainHeroImages[mainHeroIndex];
    renderMainHeroDots();
    mainHeroImage.onload = () => mainHero.classList.remove("is-changing");
  }, 180);
}

if (mainHeroImage) {
  renderMainHeroDots();
  window.setInterval(() => setMainHeroImage(mainHeroIndex + 1), 4200);
}

const cinemaVideo = document.getElementById("heroVideo");
const cinemaProgress = document.getElementById("heroProgress");
if (cinemaVideo && cinemaProgress) {
  cinemaVideo.addEventListener("timeupdate", () => {
    const percent = cinemaVideo.duration ? (cinemaVideo.currentTime / cinemaVideo.duration) * 100 : 0;
    cinemaProgress.style.width = `${percent}%`;
  });
}
// Captured Moments rolling grid and same-ratio dissolve animation
const CAPTURED_TILE_LIMIT = 100;
const capturedSection = document.querySelector(".story-captured");
const capturedFrame = document.querySelector(".story-mosaic-frame");
const capturedMosaic = document.querySelector(".story-mosaic--final");
const capturedDots = Array.from(document.querySelectorAll("[data-captured-jump]"));
let capturedCycleTiles = Array.from(document.querySelectorAll(".story-mosaic--final [data-cycle-images]"));
let capturedCyclePointer = 0;
const capturedImageCache = new Map();
let capturedLayoutTimer;
let capturedTargetProgress = 0;
let capturedCurrentProgress = 0;
let capturedRollerTicking = false;

function clampCaptured(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getCapturedColumnCount() {
  const width = window.innerWidth;
  if (width < 620) return 3;
  if (width < 980) return 4;
  if (width < 1380) return 5;
  if (width < 2400) return 6;
  if (width < 3400) return 7;
  return 8;
}

function normalizeCapturedItem(item) {
  return {
    Kind: item.Kind === "portrait" ? "portrait" : "landscape",
    File: item.File,
    Width: Number(item.Width || (item.Kind === "portrait" ? 800 : 1200)),
    Height: Number(item.Height || (item.Kind === "portrait" ? 1200 : 800))
  };
}

function getCapturedFallbackItems() {
  return Array.from(document.querySelectorAll(".story-mosaic--final [data-lightbox]")).map((tile) => {
    const image = tile.querySelector("img");
    const group = tile.getAttribute("data-cycle-group") || (tile.classList.contains("tall") ? "portrait" : "landscape");
    return normalizeCapturedItem({
      Kind: group,
      File: tile.getAttribute("data-lightbox") || (image ? image.getAttribute("src") : ""),
      Width: image ? image.getAttribute("width") : "",
      Height: image ? image.getAttribute("height") : ""
    });
  }).filter((item) => item.File);
}

function selectCapturedItems(items) {
  const landscapes = items.filter((item) => item.Kind !== "portrait");
  const portraits = items.filter((item) => item.Kind === "portrait");
  const selected = [];
  const used = new Set();
  let landscapeIndex = 0;
  let portraitIndex = 0;
  const total = Math.min(CAPTURED_TILE_LIMIT, items.length);

  for (let index = 0; index < total; index += 1) {
    const preferPortrait = portraits.length && index % 4 === 1;
    const primary = preferPortrait ? portraits : landscapes.length ? landscapes : items;
    const secondary = preferPortrait ? landscapes : portraits;
    let pool = primary;
    let pointer = preferPortrait ? portraitIndex : landscapeIndex;
    let picked = null;

    for (let tries = 0; tries < pool.length; tries += 1) {
      const candidate = pool[(pointer + tries) % pool.length];
      if (!used.has(candidate.File)) {
        picked = candidate;
        pointer += tries + 1;
        break;
      }
    }

    if (!picked && secondary.length) {
      pool = secondary;
      pointer = preferPortrait ? landscapeIndex : portraitIndex;
      for (let tries = 0; tries < pool.length; tries += 1) {
        const candidate = pool[(pointer + tries) % pool.length];
        if (!used.has(candidate.File)) {
          picked = candidate;
          pointer += tries + 1;
          break;
        }
      }
    }

    if (!picked) break;
    if (picked.Kind === "portrait") portraitIndex = pointer;
    else landscapeIndex = pointer;
    used.add(picked.File);
    selected.push(picked);
  }

  return selected;
}

function makeCapturedTile(item, index, items) {
  const tile = document.createElement("button");
  const kind = item.Kind === "portrait" ? "portrait" : "landscape";
  const kindItems = items.filter((candidate) => candidate.Kind === kind);
  const kindIndex = kindItems.findIndex((candidate) => candidate.File === item.File);
  const cycleImages = [item.File];

  for (let offset = 1; offset <= 3 && kindItems.length > 1; offset += 1) {
    const next = kindItems[(kindIndex + offset) % kindItems.length];
    if (next && next.File !== item.File) cycleImages.push(next.File);
  }

  tile.className = kind === "portrait" ? "story-tile tall" : "story-tile";
  tile.type = "button";
  tile.setAttribute("data-cycle-group", kind);
  tile.setAttribute("data-cycle-images", cycleImages.join("|"));
  tile.setAttribute("data-lightbox", item.File);
  tile.setAttribute("aria-label", `Open captured moment ${index + 1}`);

  const image = document.createElement("img");
  image.src = item.File;
  image.width = item.Width;
  image.height = item.Height;
  image.loading = index < 22 ? "eager" : "lazy";
  image.decoding = "async";
  image.alt = `Captured moment ${String(index + 1).padStart(2, "0")}`;
  if (index < 16) image.fetchPriority = "high";
  tile.appendChild(image);
  return tile;
}

function estimatedCapturedUnits(tile) {
  const image = tile.querySelector("img");
  const width = image ? Number(image.getAttribute("width")) : 0;
  const height = image ? Number(image.getAttribute("height")) : 0;
  if (width && height) return height / width;
  return (tile.getAttribute("data-cycle-group") || "landscape") === "portrait" ? 1.5 : 0.667;
}

function layoutCapturedMasonry() {
  if (!capturedMosaic || !capturedCycleTiles.length) return;
  const columnCount = getCapturedColumnCount();
  if (capturedMosaic.dataset.columns === String(columnCount) && capturedMosaic.querySelector(".story-mosaic-column")) return;
  capturedMosaic.dataset.columns = String(columnCount);
  capturedMosaic.style.setProperty("--captured-columns", String(columnCount));
  capturedMosaic.style.setProperty("grid-template-columns", `repeat(${columnCount}, minmax(0, 1fr))`, "important");
  const columns = Array.from({ length: columnCount }, () => {
    const column = document.createElement("div");
    column.className = "story-mosaic-column";
    return { element: column, units: 0 };
  });
  capturedMosaic.textContent = "";
  capturedCycleTiles.forEach((tile) => {
    const units = estimatedCapturedUnits(tile);
    const target = columns.reduce((shortest, column) => (column.units < shortest.units ? column : shortest), columns[0]);
    target.element.appendChild(tile);
    target.units += units;
  });
  columns.forEach((column) => capturedMosaic.appendChild(column.element));
  updateCapturedTarget();
}

function updateCapturedTarget() {
  if (!capturedSection || !capturedFrame || !capturedMosaic) return;
  const rect = capturedSection.getBoundingClientRect();
  const scrollable = capturedSection.offsetHeight - window.innerHeight;
  capturedTargetProgress = clampCaptured(-rect.top / Math.max(1, scrollable), 0, 1);
  if (!capturedRollerTicking) {
    capturedRollerTicking = true;
    window.requestAnimationFrame(renderCapturedRoller);
  }
}

function renderCapturedRoller() {
  if (!capturedFrame || !capturedMosaic) {
    capturedRollerTicking = false;
    return;
  }

  if (capturedTargetProgress <= 0.002 || capturedTargetProgress >= 0.998) {
    capturedCurrentProgress = capturedTargetProgress;
  } else {
    capturedCurrentProgress += (capturedTargetProgress - capturedCurrentProgress) * 0.085;
  }

  if (Math.abs(capturedTargetProgress - capturedCurrentProgress) < 0.0008) {
    capturedCurrentProgress = capturedTargetProgress;
  }

  const raw = capturedCurrentProgress;
  const eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
  const columns = capturedMosaic.querySelectorAll(".story-mosaic-column");
  const frameRect = capturedFrame.getBoundingClientRect();
  const mosaicRect = capturedMosaic.getBoundingClientRect();
  const mosaicTop = mosaicRect.top - frameRect.top;
  const safetyPad = Math.max(window.innerHeight * 0.82, 980);

  columns.forEach((column) => {
    const end = Math.min(0, capturedFrame.clientHeight + safetyPad - mosaicTop - column.scrollHeight);
    column.style.transform = `translate3d(0, ${end * eased}px, 0)`;
  });

  capturedDots.forEach((dot, index) => {
    const active = index === Math.min(capturedDots.length - 1, Math.floor(raw * capturedDots.length));
    dot.classList.toggle("is-active", active);
  });

  if (Math.abs(capturedTargetProgress - capturedCurrentProgress) > 0.0008) {
    window.requestAnimationFrame(renderCapturedRoller);
  } else {
    capturedRollerTicking = false;
  }
}

function preloadCapturedImage(src) {
  if (capturedImageCache.has(src)) return capturedImageCache.get(src);
  const preload = new Promise((resolve, reject) => {
    const next = new Image();
    next.onload = () => resolve(src);
    next.onerror = reject;
    next.src = src;
  });
  capturedImageCache.set(src, preload);
  return preload;
}

function cycleCapturedTile() {
  if (!capturedCycleTiles.length || document.hidden) return;
  const tile = capturedCycleTiles[capturedCyclePointer % capturedCycleTiles.length];
  capturedCyclePointer += 1;
  const image = tile.querySelector("img");
  const images = (tile.getAttribute("data-cycle-images") || "").split("|").filter(Boolean);
  if (!image || images.length < 2) return;
  const nextIndex = (Number(tile.dataset.cycleIndex || 0) + 1) % images.length;
  const nextImage = images[nextIndex];
  preloadCapturedImage(nextImage).then(() => {
    tile.dataset.cycleIndex = String(nextIndex);
    tile.classList.add("is-fading");
    window.setTimeout(() => {
      image.src = nextImage;
      tile.setAttribute("data-lightbox", nextImage);
      tile.classList.remove("is-fading");
      tile.classList.add("is-settling");
      window.setTimeout(() => tile.classList.remove("is-settling"), 780);
    }, 320);
  }).catch(() => {});
}

async function hydrateCapturedGallery() {
  if (!capturedMosaic) return;
  const fallbackItems = getCapturedFallbackItems();
  try {
    const response = await fetch("assets/grid-gallery/manifest.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Captured Moments manifest unavailable");
    const manifest = await response.json();
    const normalized = Array.isArray(manifest) ? manifest.map(normalizeCapturedItem).filter((item) => item.File) : [];
    const selected = selectCapturedItems(normalized);
    if (!selected.length) throw new Error("Captured Moments manifest is empty");
    capturedMosaic.textContent = "";
    selected.forEach((item, index) => capturedMosaic.appendChild(makeCapturedTile(item, index, selected)));
    capturedCycleTiles = Array.from(capturedMosaic.querySelectorAll("[data-cycle-images]"));
    capturedMosaic.dataset.columns = "";
  } catch {
    if (fallbackItems.length && !capturedCycleTiles.length) {
      capturedCycleTiles = Array.from(capturedMosaic.querySelectorAll("[data-cycle-images]"));
    }
  }
}

async function initCapturedGallery() {
  if (!capturedMosaic) return;
  await hydrateCapturedGallery();
  layoutCapturedMasonry();
  updateCapturedTarget();
  window.addEventListener("resize", () => {
    window.clearTimeout(capturedLayoutTimer);
    capturedLayoutTimer = window.setTimeout(() => {
      capturedMosaic.dataset.columns = "";
      layoutCapturedMasonry();
      updateCapturedTarget();
    }, 160);
  }, { passive: true });
  window.addEventListener("scroll", updateCapturedTarget, { passive: true });
  capturedDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      if (!capturedSection) return;
      const jump = Number(dot.getAttribute("data-captured-jump") || 0);
      const travel = Math.max(1, capturedSection.offsetHeight - window.innerHeight);
      window.scrollTo({
        top: capturedSection.offsetTop + travel * clampCaptured(jump, 0, 1),
        behavior: "smooth"
      });
    });
  });
  capturedCycleTiles.forEach((tile) => {
    const images = (tile.getAttribute("data-cycle-images") || "").split("|").filter(Boolean);
    images.slice(1).forEach((src) => preloadCapturedImage(src));
  });
  window.setInterval(cycleCapturedTile, 3200);
  window.setTimeout(cycleCapturedTile, 1200);
}

if (capturedCycleTiles.length || capturedMosaic) {
  initCapturedGallery();
}
// Spotlight Films cinematic player. Add real YouTube embed URLs to data-youtube-src.
const spotlightRoot = document.querySelector("[data-spotlight]");
const spotlightPlayer = document.querySelector(".spotlight-player");
const spotlightMainImage = document.getElementById("spotlight-main-image");
const spotlightTitle = document.getElementById("spotlight-title");
const spotlightCopy = document.getElementById("spotlight-copy");
const spotlightPlay = document.getElementById("spotlight-play");
const spotlightThumbs = Array.from(document.querySelectorAll(".spotlight-thumb"));
const spotlightPrev = document.querySelector("[data-spotlight-prev]");
const spotlightNext = document.querySelector("[data-spotlight-next]");
const spotlightToggleControls = Array.from(document.querySelectorAll("[data-spotlight-toggle]"));
const spotlightVolume = document.querySelector("[data-spotlight-volume]");
const spotlightSettings = document.querySelector("[data-spotlight-settings]");
const spotlightFullscreen = document.querySelector("[data-spotlight-fullscreen]");
const youtubeModal = document.getElementById("youtube-modal");
const youtubeFrame = document.getElementById("youtube-frame");
const youtubeClose = document.getElementById("youtube-modal-close");
const youtubeModalTitle = document.getElementById("youtube-modal-title");
let activeYoutubeSrc = spotlightPlay ? spotlightPlay.getAttribute("data-youtube-src") || "" : "";

function setSpotlightThumb(thumb) {
  if (!thumb || !spotlightMainImage || !spotlightTitle || !spotlightCopy || !spotlightPlay) return;
  const nextImage = thumb.getAttribute("data-spotlight-image") || "";
  const nextTitle = thumb.getAttribute("data-spotlight-title") || "";
  const nextCopy = thumb.getAttribute("data-spotlight-copy") || "";
  activeYoutubeSrc = thumb.getAttribute("data-youtube-src") || "";
  spotlightThumbs.forEach((item) => item.classList.toggle("is-active", item === thumb));
  if (spotlightPlayer) spotlightPlayer.classList.remove("is-playing");
  if (spotlightPlayer) spotlightPlayer.classList.add("is-switching");
  window.setTimeout(() => {
    if (nextImage) spotlightMainImage.src = nextImage;
    if (nextTitle) {
      spotlightTitle.innerHTML = nextTitle;
      spotlightPlay.setAttribute("aria-label", `Play ${nextTitle.replace(/&amp;/g, "and")} film`);
    }
    if (nextCopy) spotlightCopy.textContent = nextCopy;
    spotlightPlay.setAttribute("data-youtube-src", activeYoutubeSrc);
    if (spotlightPlayer) spotlightPlayer.classList.remove("is-switching");
  }, 180);
}

spotlightThumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => setSpotlightThumb(thumb));
});

function moveSpotlight(direction) {
  if (!spotlightThumbs.length) return;
  const activeIndex = Math.max(0, spotlightThumbs.findIndex((thumb) => thumb.classList.contains("is-active")));
  const nextIndex = (activeIndex + direction + spotlightThumbs.length) % spotlightThumbs.length;
  setSpotlightThumb(spotlightThumbs[nextIndex]);
  spotlightThumbs[nextIndex].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

if (spotlightPrev) spotlightPrev.addEventListener("click", () => moveSpotlight(-1));
if (spotlightNext) spotlightNext.addEventListener("click", () => moveSpotlight(1));

function setSpotlightPreviewPlaying(force) {
  if (!spotlightPlayer) return false;
  const shouldPlay = typeof force === "boolean" ? force : !spotlightPlayer.classList.contains("is-playing");
  spotlightPlayer.classList.toggle("is-playing", shouldPlay);
  if (spotlightRoot) {
    spotlightRoot.classList.add("is-custom-playing");
    window.setTimeout(() => spotlightRoot.classList.remove("is-custom-playing"), 900);
  }
  return shouldPlay;
}

function toggleSpotlightPlayback() {
  if (activeYoutubeSrc && youtubeModal && youtubeFrame) {
    openYoutubeModal(activeYoutubeSrc);
    return;
  }
  setSpotlightPreviewPlaying();
}

function openYoutubeModal(src) {
  if (!src || !youtubeModal || !youtubeFrame) {
    setSpotlightPreviewPlaying();
    return;
  }
  const separator = src.includes("?") ? "&" : "?";
  youtubeFrame.src = `${src}${separator}autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  if (youtubeModalTitle && spotlightTitle) youtubeModalTitle.textContent = spotlightTitle.textContent || "Spotlight Film";
  youtubeModal.hidden = false;
  document.body.classList.add("video-modal-open");
}

function closeYoutubeModal() {
  if (!youtubeModal || !youtubeFrame) return;
  youtubeModal.hidden = true;
  youtubeFrame.src = "";
  document.body.classList.remove("video-modal-open");
}

if (spotlightPlay) {
  spotlightPlay.addEventListener("click", toggleSpotlightPlayback);
}
spotlightToggleControls.forEach((control) => control.addEventListener("click", toggleSpotlightPlayback));
if (spotlightVolume && spotlightPlayer) {
  spotlightVolume.addEventListener("click", () => spotlightPlayer.classList.toggle("is-muted"));
}
if (spotlightSettings && spotlightPlayer) {
  spotlightSettings.addEventListener("click", () => {
    spotlightPlayer.classList.add("is-control-pulse");
    window.setTimeout(() => spotlightPlayer.classList.remove("is-control-pulse"), 700);
  });
}
if (spotlightFullscreen && spotlightPlayer) {
  spotlightFullscreen.addEventListener("click", () => {
    if (document.fullscreenElement === spotlightPlayer && document.exitFullscreen) {
      document.exitFullscreen();
      return;
    }
    if (spotlightPlayer.requestFullscreen) {
      spotlightPlayer.requestFullscreen().catch(() => spotlightPlayer.classList.toggle("is-custom-fullscreen"));
      return;
    }
    spotlightPlayer.classList.toggle("is-custom-fullscreen");
  });
}
if (spotlightPlayer) {
  document.addEventListener("fullscreenchange", () => {
    spotlightPlayer.classList.toggle("is-custom-fullscreen", document.fullscreenElement === spotlightPlayer);
  });
}
if (youtubeClose) youtubeClose.addEventListener("click", closeYoutubeModal);
if (youtubeModal) {
  youtubeModal.addEventListener("click", (event) => {
    if (event.target === youtubeModal) closeYoutubeModal();
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeYoutubeModal();
    if (spotlightPlayer) spotlightPlayer.classList.remove("is-custom-fullscreen");
  }
});

// Optional validation/deep-link helper: main.html?scrollTo=spotlight
const scrollTarget = new URLSearchParams(window.location.search).get("scrollTo");
if (scrollTarget) {
  window.setTimeout(() => {
    const target = document.getElementById(scrollTarget);
    if (target) target.scrollIntoView({ block: "start" });
  }, 420);
}

async function hydratePublicSiteData() {
  try {
    const response = await fetch("/api/public/site", { headers: { accept: "application/json" } });
    if (!response.ok) return;
    const data = await response.json();
    const posts = Array.isArray(data.instagram) ? data.instagram : [];
    const slots = Array.from(document.querySelectorAll("[data-instagram-post]"));

    posts.slice(0, slots.length).forEach((post, index) => {
      const slot = slots[index];
      const image = slot.querySelector("img");
      const source = post.thumbnailUrl || post.mediaUrl;
      slot.href = post.permalink;
      if (image && source) image.src = source;
      if (image && post.caption) image.alt = post.caption.slice(0, 140);
    });

    const instagramValue = String(data.brand?.instagram || "");
    const instagramHref = instagramValue.startsWith("http")
      ? instagramValue
      : `https://instagram.com/${instagramValue.replace(/^@/, "")}`;
    if (instagramValue) {
      document.querySelectorAll('a[href="https://instagram.com"]').forEach((link) => {
        link.href = instagramHref;
      });
    }
  } catch {
    // Static fallbacks stay visible if the content API is temporarily unavailable.
  }
}

hydratePublicSiteData();
