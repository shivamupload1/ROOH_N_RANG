const pages = [
  { id: "dashboard", path: "/admin/dashboard", label: "Dashboard", tag: "Overview", group: "Core" },
  { id: "site-settings", path: "/admin/site-settings", label: "Site Settings", tag: "Brand", group: "Website" },
  { id: "welcome-page", path: "/admin/welcome-page", label: "Welcome Page", tag: "Hero", group: "Website" },
  { id: "main-page", path: "/admin/main-page", label: "Main Page", tag: "Home", group: "Website" },
  { id: "captured-moments", path: "/admin/captured-moments", label: "Captured Moments", tag: "Grid", group: "Content" },
  { id: "featured-stories", path: "/admin/featured-stories", label: "Featured Stories", tag: "Stories", group: "Content" },
  { id: "spotlight-films", path: "/admin/spotlight-films", label: "Spotlight Films", tag: "YouTube", group: "Content" },
  { id: "soul-cinema", path: "/admin/soul-cinema", label: "Soul and Cinema", tag: "Film", group: "Content" },
  { id: "clients", path: "/admin/clients", label: "Clients", tag: "CRM", group: "Gallery" },
  { id: "client-galleries", path: "/admin/client-galleries", label: "Client Galleries", tag: "PIN", group: "Gallery" },
  { id: "drive-accounts", path: "/admin/drive-accounts", label: "Drive Accounts", tag: "OAuth", group: "Drive" },
  { id: "gallery-folders", path: "/admin/gallery-folders", label: "Gallery Folders", tag: "Drive", group: "Drive" },
  { id: "gallery-preview", path: "/admin/gallery-preview", label: "Preview and Status", tag: "Stats", group: "Drive" }
];

const dashboardStats = [
  ["Portfolio Images", "2,500", "Preview pipeline placeholder"],
  ["Featured Stories", "02", "Published story slots"],
  ["Films", "02", "YouTube only"],
  ["Clients", "00", "CRM placeholder"],
  ["Client Galleries", "00", "Private/public links"],
  ["Drive Accounts", "00", "Client Google Drive OAuth"]
];

const pageData = {
  "site-settings": {
    title: "Site Settings",
    intro: "Studio identity, contact details, social links, WhatsApp, YouTube and logo controls.",
    fields: ["Studio Name", "Contact Number", "Email", "Address", "Google Maps Link", "Instagram URL", "Facebook URL", "WhatsApp Number", "YouTube URL", "Logo URL"]
  },
  "welcome-page": {
    title: "Welcome Page Manager",
    intro: "Logo, heading, sub heading, typography controls, color choices, publish status and background image set.",
    fields: ["Logo", "Main Heading", "Sub Heading", "Heading Font", "Heading Size", "Heading Color", "Sub Font", "Sub Size", "Sub Color", "Background Images Folder", "Publish Status"]
  },
  "main-page": {
    title: "Main Page Manager",
    intro: "Top slideshow, intro section, captured moments shortcut, featured stories shortcut, films and Soul + Cinema controls.",
    fields: ["Slide Show Folder", "Selected Images", "Desktop Position", "Mobile Position", "Intro Heading", "Intro Text", "Captured Shortcut", "Featured Shortcut", "Spotlight Shortcut", "Soul Cinema Shortcut"]
  },
  "captured-moments": {
    title: "Captured Moments",
    intro: "Portfolio grid media manager with category, visibility, alt text, caption and sort order.",
    fields: ["Image URL", "Caption", "Alt Text", "Category", "Visible", "Sort Order"]
  },
  "featured-stories": {
    title: "Featured Stories",
    intro: "Create story pages with slug, cover, top image, about text, typography and gallery images.",
    fields: ["Story Name", "Slug", "Cover Image", "Top Image", "About Text", "Font Family", "Text Color", "Published", "Sort Order", "Story Images Folder"]
  },
  "spotlight-films": {
    title: "Spotlight Films",
    intro: "YouTube-only films manager for title, YouTube URL, thumbnail, featured status, publish status and ordering.",
    fields: ["Film Title", "YouTube URL", "Thumbnail URL", "Featured Film", "Published", "Sort Order"]
  },
  "soul-cinema": {
    title: "Soul and Cinema",
    intro: "Cinematic page section manager with heading, text, typography, color, YouTube/video source and publish status.",
    fields: ["Bold Heading", "Standard Text", "Font Family", "Font Size", "Text Color", "YouTube URL", "Publish Status"]
  },
  "clients": {
    title: "Clients",
    intro: "Client records for name, phone, email, address, event, event date and gallery creation shortcut.",
    fields: ["Client Name", "Date", "Phone", "Email", "Address", "Event", "Description"]
  },
  "client-galleries": {
    title: "Client Galleries",
    intro: "Gallery setup with client, cover, hashtags, public/private links, hashed PIN placeholders, expiry and download access.",
    fields: ["Select Client", "Gallery Name", "Hashtag", "Sub Line", "Cover Image", "Desktop Cover Position", "Mobile Cover Position", "Download Access", "Private Slug", "Private PIN", "Private Expiry", "Private Status", "Public Slug", "Public PIN", "Public Expiry", "Public Status"]
  },
  "drive-accounts": {
    title: "Drive Accounts",
    intro: "Client Google Drive account records. OAuth only, no Google password fields. Videos remain YouTube-only.",
    fields: ["Drive Account Name", "Google Email", "Account Type", "Root Folder ID", "OAuth Connected", "Account Status", "Last Synced At"]
  },
  "gallery-folders": {
    title: "Gallery Folders",
    intro: "Connect gallery folders to client Google Drive folder links/IDs and track sync status, file count and sorting.",
    fields: ["Select Gallery", "Folder Name", "Drive Folder Link", "Drive Folder ID", "File Count", "Sync Status", "Sort Order"]
  },
  "gallery-preview": {
    title: "Gallery Preview and Status",
    intro: "Preview cover, folders, media grid, visible/download toggles and analytics before sharing gallery links.",
    fields: ["Select Gallery", "Public Status", "Private Status", "Expiry Status", "Total Photos", "Total Videos", "Downloads", "Favorites", "Likes", "Comments", "Views", "Last Activity"]
  }
};

function getPageId() {
  const path = window.location.pathname.replace(/\/$/, "");
  if (path === "/admin" || path === "/admin/dashboard") return "dashboard";
  if (path === "/admin/login") return "login";
  const match = pages.find((page) => page.path === path);
  return match ? match.id : "dashboard";
}

function linkFor(page) {
  return `<a href="${page.path}" class="${getPageId() === page.id ? "is-active" : ""}"><span>${page.label}</span><small>${page.tag}</small></a>`;
}

function renderLogin() {
  document.body.classList.remove("admin-menu-open");
  return `
    <main class="admin-login" data-auth-mode="login">
      <section class="admin-login__content" aria-label="Rooh N Rang login">
        <div class="admin-login__copy">
          <span>ROOH N RANG</span>
          <h1>Access the studio space.</h1>
          <p>One secure doorway for gallery links, website updates, Drive sync placeholders and future Supabase Auth.</p>
        </div>
        <section class="admin-login__card">
          <div class="admin-brand"><span>Rooh N Rang Stories</span><strong data-auth-title>Login</strong></div>
          <div class="admin-auth-switch" aria-label="Authentication mode">
            <button type="button" class="is-active" data-auth-switch="login" aria-pressed="true">Login</button>
            <button type="button" data-auth-switch="signup" aria-pressed="false">Signup</button>
          </div>
          <form class="admin-form" data-login-form>
            <div class="admin-field admin-signup-field"><label>Name</label><input type="text" placeholder="Your name" autocomplete="name"></div>
            <div class="admin-field"><label>Email</label><input type="email" placeholder="name@example.com" autocomplete="email"></div>
            <div class="admin-field"><label>Password</label><input type="password" placeholder="Supabase Auth password" autocomplete="current-password"></div>
            <button class="admin-button admin-login-submit" type="submit" data-auth-submit>Open Placeholder</button>
          </form>
          <p class="admin-note">Static placeholder only. Final version will use Supabase Auth, protected routes and no hardcoded password.</p>
        </section>
      </section>
      <aside class="admin-login__visual" aria-hidden="true">
        <span class="admin-login__slide admin-login__slide--one"></span>
        <span class="admin-login__slide admin-login__slide--two"></span>
        <span class="admin-login__slide admin-login__slide--three"></span>
        <div class="admin-login__visual-text">
          <span>FRAMED WITH FEELING</span>
          <strong>Quiet, cinematic, private.</strong>
        </div>
      </aside>
    </main>
  `;
}

function renderShell(content) {
  const groups = pages.reduce((acc, page) => {
    acc[page.group] = acc[page.group] || [];
    acc[page.group].push(page);
    return acc;
  }, {});
  const nav = Object.entries(groups).map(([, items]) => `
    <div class="admin-nav-group">
      ${items.map(linkFor).join("")}
    </div>
  `).join("");
  return `
    <div class="admin-shell">
      <aside class="admin-sidebar">
        <div class="admin-sidebar__top"><strong>ROOH n RANG</strong><span>Admin MVP Placeholder</span></div>
        <nav class="admin-nav">${nav}</nav>
        <div class="admin-sidebar__bottom"><a class="admin-button secondary" href="/admin/login">Logout Placeholder</a></div>
      </aside>
      <main class="admin-main">
        <header class="admin-topbar">
          <button class="admin-menu-toggle" type="button" data-menu-toggle aria-label="Toggle admin menu"><span></span><span></span></button>
          <div><span class="admin-kicker">Admin Panel</span><h1 class="admin-title">${currentTitle()}</h1></div>
          <a class="admin-button ghost" href="/main">View Website</a>
        </header>
        <div class="admin-content">${content}</div>
      </main>
    </div>
  `;
}

function currentTitle() {
  const id = getPageId();
  if (id === "dashboard") return "Dashboard";
  return pageData[id]?.title || "Dashboard";
}

function renderDashboard() {
  const stats = dashboardStats.map(([label, value, note]) => `
    <article class="admin-card admin-stat"><span class="admin-kicker">${label}</span><strong>${value}</strong><p>${note}</p></article>
  `).join("");
  return `
    <section class="admin-grid">
      ${stats}
      <article class="admin-card wide">
        <h3>Build Order</h3>
        <div class="admin-list">
          ${["Admin shell and protected routes", "Supabase Auth", "Database schema", "Website content managers", "Client galleries", "Client Google Drive folder sync", "Gallery preview and status", "Connect public site to published data"].map((item, index) => `<div class="admin-list-item"><div><strong>${index + 1}. ${item}</strong><span>Placeholder ready for implementation.</span></div><span class="admin-badge">Queued</span></div>`).join("")}
        </div>
      </article>
      <article class="admin-card">
        <h3>Security Rules</h3>
        <div class="admin-chip-row">
          <span class="admin-chip">No hardcoded password</span>
          <span class="admin-chip">Supabase Auth</span>
          <span class="admin-chip">PIN hash only</span>
          <span class="admin-chip">Drive OAuth only</span>
          <span class="admin-chip">YouTube videos only</span>
        </div>
      </article>
    </section>
  `;
}

function renderFormFields(fields) {
  return fields.map((field) => {
    const lower = field.toLowerCase();
    const type = lower.includes("date") || lower.includes("expiry") ? "date" : lower.includes("email") ? "email" : lower.includes("url") || lower.includes("link") ? "url" : lower.includes("color") ? "color" : "text";
    if (lower.includes("text") || lower.includes("description") || lower.includes("address") || lower.includes("about")) {
      return `<div class="admin-field full"><label>${field}</label><textarea placeholder="${field} placeholder"></textarea></div>`;
    }
    if (lower.includes("status") || lower.includes("published") || lower.includes("visible") || lower.includes("access") || lower.includes("type") || lower.includes("family")) {
      return `<div class="admin-field"><label>${field}</label><select><option>Placeholder</option><option>Published</option><option>Draft</option><option>Hidden</option></select></div>`;
    }
    return `<div class="admin-field"><label>${field}</label><input type="${type}" placeholder="${field}"></div>`;
  }).join("");
}

function renderGenericPage(id) {
  const data = pageData[id];
  return `
    <section class="admin-grid">
      <article class="admin-card wide">
        <h3>${data.title}</h3>
        <p>${data.intro}</p>
        <form class="admin-form-grid">
          ${renderFormFields(data.fields)}
          <div class="full"><button class="admin-button" type="button">Save Placeholder</button> <button class="admin-button secondary" type="button">Preview Placeholder</button></div>
        </form>
      </article>
      <article class="admin-card">
        <h3>Included Points</h3>
        <div class="admin-chip-row">${data.fields.map((field) => `<span class="admin-chip">${field}</span>`).join("")}</div>
      </article>
      <article class="admin-card full">
        <h3>Future Data Area</h3>
        <div class="admin-empty"><div><strong>No live records yet</strong><span>This placeholder will connect to Supabase Postgres after schema/auth implementation.</span></div></div>
      </article>
    </section>
  `;
}

function renderApp() {
  const id = getPageId();
  if (id === "login") {
    document.getElementById("admin-app").innerHTML = renderLogin();
    document.querySelectorAll("[data-auth-switch]").forEach((button) => {
      button.addEventListener("click", () => {
        const mode = button.dataset.authSwitch;
        const login = document.querySelector(".admin-login");
        const title = document.querySelector("[data-auth-title]");
        const submit = document.querySelector("[data-auth-submit]");
        login?.setAttribute("data-auth-mode", mode);
        document.querySelectorAll("[data-auth-switch]").forEach((item) => {
          const active = item.dataset.authSwitch === mode;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });
        if (title) title.textContent = mode === "signup" ? "Signup" : "Login";
        if (submit) submit.textContent = mode === "signup" ? "Create Placeholder" : "Open Placeholder";
      });
    });
    document.querySelector("[data-login-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      window.location.href = "/admin/dashboard";
    });
    return;
  }
  const content = id === "dashboard" ? renderDashboard() : renderGenericPage(id);
  document.getElementById("admin-app").innerHTML = renderShell(content);
  document.querySelector("[data-menu-toggle]")?.addEventListener("click", () => document.body.classList.toggle("admin-menu-open"));
  document.querySelectorAll(".admin-nav a").forEach((link) => link.addEventListener("click", () => document.body.classList.remove("admin-menu-open")));
}

renderApp();
