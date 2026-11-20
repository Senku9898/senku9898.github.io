(function () {
  const app = document.getElementById("app");
  const config = window.NEXA_CONFIG || {};

  const strings = {
    ar: {
      badge: "قريباً على أندرويد",
      tagline: "مراسلة آمنة، سريعة، وخاصة. بدون تعقيد.",
      download: "تحميل Nexa",
      downloadSoon: "التحميل قريباً",
      secure: "مشفّر",
      secureDesc: "حماية كاملة لمحادثاتك",
      fast: "سريع",
      fastDesc: "أداء خفيف وسلس",
      private: "خاص",
      privateDesc: "بياناتك تبقى عندك",
      simple: "بسيط",
      simpleDesc: "واجهة نظيفة وسهلة",
      profileNotFound: "الملف الشخصي غير متوفر",
      profileNotFoundDesc: "قد يكون الرابط غير صحيح أو تم حذف الحساب.",
      backHome: "العودة للرئيسية",
      loading: "جاري التحميل...",
      lang: "English",
      footer: "Nexa"
    },
    en: {
      badge: "Coming soon on Android",
      tagline: "Secure, fast, and private messaging. No noise.",
      download: "Download Nexa",
      downloadSoon: "Coming soon",
      secure: "Encrypted",
      secureDesc: "Full protection for your chats",
      fast: "Fast",
      fastDesc: "Light and smooth performance",
      private: "Private",
      privateDesc: "Your data stays yours",
      simple: "Simple",
      simpleDesc: "Clean, easy interface",
      profileNotFound: "Profile unavailable",
      profileNotFoundDesc: "The link may be incorrect or the account was removed.",
      backHome: "Back to home",
      loading: "Loading...",
      lang: "العربية",
      footer: "Nexa"
    }
  };

  let lang = localStorage.getItem("nexa_lang") || "ar";

  function t(key) {
    return (strings[lang] && strings[lang][key]) || key;
  }

  function setLang(l) {
    lang = l;
    localStorage.setItem("nexa_lang", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    render();
  }

  function getProfileId() {
    const path = window.location.pathname;
    const match = path.match(/^\/u\/([a-zA-Z0-9_-]+)\/?$/);
    return match ? match[1] : null;
  }

  async function fetchProfile(profileId) {
    if (!config.profileApiBase) return null;
    try {
      const res = await fetch(`${config.profileApiBase}/${encodeURIComponent(profileId)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function headerHtml() {
    return `
      <header class="header">
        <a href="/" class="logo">
          <div class="logo-mark">N</div>
          <span>Nexa</span>
        </a>
        <button class="lang-btn" id="langToggle">${t("lang")}</button>
      </header>
    `;
  }

  function footerHtml() {
    return `<footer class="footer">© ${t("footer")}</footer>`;
  }

  function bindLang() {
    const btn = document.getElementById("langToggle");
    if (btn) btn.onclick = () => setLang(lang === "ar" ? "en" : "ar");
  }

  function renderHome() {
    const hasApk = false; // becomes true once a real release exists

    app.innerHTML = `
      <div class="container">
        ${headerHtml()}
        <section class="hero">
          <div class="badge">
            <span class="badge-dot"></span>
            ${t("badge")}
          </div>
          <h1>Nexa</h1>
          <p class="hero-sub">${t("tagline")}</p>
          <a class="btn-download ${hasApk ? "" : "soon"}" href="${hasApk ? (config.latestApkUrl || "#") : "#"}" ${hasApk ? "" : "onclick=\"return false;\""}>
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            ${hasApk ? t("download") : t("downloadSoon")}
          </a>

          <div class="features">
            <div class="feature">
              <div class="feature-icon">🔒</div>
              <h3>${t("secure")}</h3>
              <p>${t("secureDesc")}</p>
            </div>
            <div class="feature">
              <div class="feature-icon">⚡</div>
              <h3>${t("fast")}</h3>
              <p>${t("fastDesc")}</p>
            </div>
            <div class="feature">
              <div class="feature-icon">🛡️</div>
              <h3>${t("private")}</h3>
              <p>${t("privateDesc")}</p>
            </div>
            <div class="feature">
              <div class="feature-icon">✨</div>
              <h3>${t("simple")}</h3>
              <p>${t("simpleDesc")}</p>
            </div>
          </div>
        </section>
        ${footerHtml()}
      </div>
    `;
    bindLang();
  }

  function renderFallback() {
    app.innerHTML = `
      <div class="container">
        ${headerHtml()}
        <div class="fallback">
          <div class="fallback-icon">?</div>
          <h2>${t("profileNotFound")}</h2>
          <p>${t("profileNotFoundDesc")}</p>
          <a class="btn-secondary" href="/">${t("backHome")}</a>
        </div>
        ${footerHtml()}
      </div>
    `;
    bindLang();
  }

  function renderProfile(profile) {
    const name = profile.displayName || profile.name || profile.username || "User";
    const username = profile.username ? `@${profile.username}` : "";
    const bio = profile.bio || profile.about || "";
    const avatar = profile.avatarUrl || profile.photoUrl || "";
    const initial = (name.charAt(0) || "N").toUpperCase();

    app.innerHTML = `
      <div class="container">
        ${headerHtml()}
        <div class="profile-wrap">
          <div class="profile-card">
            ${avatar
              ? `<img class="avatar" src="${escapeHtml(avatar)}" alt="" />`
              : `<div class="avatar-placeholder">${escapeHtml(initial)}</div>`}
            <div class="display-name">${escapeHtml(name)}</div>
            ${username ? `<div class="username">${escapeHtml(username)}</div>` : ""}
            ${bio ? `<div class="bio">${escapeHtml(bio)}</div>` : ""}
            <a class="btn-download" href="${config.latestApkUrl || "#"}">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              ${t("download")}
            </a>
          </div>
        </div>
        ${footerHtml()}
      </div>
    `;
    bindLang();
  }

  function renderLoading() {
    app.innerHTML = `
      <div class="container">
        ${headerHtml()}
        <div class="loading">
          <div class="spinner"></div>
          <span>${t("loading")}</span>
        </div>
      </div>
    `;
    bindLang();
  }

  async function render() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    const profileId = getProfileId();

    if (!profileId) {
      renderHome();
      return;
    }

    renderLoading();
    const profile = await fetchProfile(profileId);
    if (profile) {
      renderProfile(profile);
    } else {
      renderFallback();
    }
  }

  render();
})();
