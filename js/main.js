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
menuOpenButtons.forEach((button) => button.addEventListener("click", () => document.body.classList.add("menu-open")));
menuCloseButtons.forEach((button) => button.addEventListener("click", () => document.body.classList.remove("menu-open")));

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

document.querySelectorAll("[data-lightbox]").forEach((tile) => {
  tile.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = tile.getAttribute("data-lightbox") || "";
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
  });
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
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=3000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=3000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=3000&auto=format&fit=crop"
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
// Captured Moments smooth dissolve animation
const capturedCycleTiles = Array.from(document.querySelectorAll(".story-mosaic--final [data-cycle-images]"));
let capturedCyclePointer = 0;

function highResCapturedUrl(url) {
  return url.replace(/([?&]w=)\d+/i, (_, prefix) => `${prefix}2400`);
}

function cycleCapturedTile() {
  if (!capturedCycleTiles.length || document.hidden) return;
  const tile = capturedCycleTiles[capturedCyclePointer % capturedCycleTiles.length];
  capturedCyclePointer += 1;
  const image = tile.querySelector("img");
  const images = (tile.getAttribute("data-cycle-images") || "").split("|").filter(Boolean);
  if (!image || images.length < 2) return;
  const nextIndex = (Number(tile.dataset.cycleIndex || 0) + 1) % images.length;
  tile.dataset.cycleIndex = String(nextIndex);
  const nextImage = images[nextIndex];
  tile.classList.add("is-fading");
  window.setTimeout(() => {
    image.src = nextImage;
    tile.setAttribute("data-lightbox", highResCapturedUrl(nextImage));
    tile.classList.remove("is-fading");
    tile.classList.add("is-settling");
    window.setTimeout(() => tile.classList.remove("is-settling"), 780);
  }, 360);
}

if (capturedCycleTiles.length) {
  window.setInterval(cycleCapturedTile, 2400);
  window.setTimeout(cycleCapturedTile, 1200);
}
