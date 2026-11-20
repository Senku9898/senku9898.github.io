(function () {
  const app = document.getElementById("app");
  const config = window.NEXA_CONFIG || {};

  const strings = {
    ar: {
      tagline: "تطبيق المراسلة الآمن والسريع",
      download: "تحميل Nexa",
      downloadSoon: "التحميل قريباً",
      profileNotFound: "الملف الشخصي غير متوفر",
      profileNotFoundDesc: "قد يكون الرابط غير صحيح أو تم حذف الحساب.",
      backHome: "العودة للرئيسية",
      loading: "جاري التحميل...",
      lang: "English"
    },
    en: {
      tagline: "Secure & fast messaging",
      download: "Download Nexa",
      downloadSoon: "Coming soon",
      profileNotFound: "Profile unavailable",
      profileNotFoundDesc: "The link may be incorrect or the account was removed.",
      backHome: "Back to home",
      loading: "Loading...",
      lang: "العربية"
    }
  };

  let lang = localStorage.getItem("nexa_lang") || "ar";

  function t(key) {
    return strings[lang][key] || key;
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

  function renderHome() {
    const hasApk = false;
    app.innerHTML = `
      <div class="container">
        <header>
          <div class="logo">Nexa<span>.</span></div>
          <button class="lang-btn" id="langToggle">${t("lang")}</button>
        </header>
        <section class="hero">
          <h1>Nexa</h1>
          <p>${t("tagline")}</p>
          <a class="btn" href="${config.latestApkUrl || "#"}" id="downloadBtn">
            ${hasApk ? t("download") : t("downloadSoon")}
          </a>
        </section>
        <footer>© Nexa</footer>
      </div>
    `;
    document.getElementById("langToggle").onclick = () => setLang(lang === "ar" ? "en" : "ar");
  }

  function renderFallback() {
    app.innerHTML = `
      <div class="container">
        <header>
          <div class="logo">Nexa<span>.</span></div>
          <button class="lang-btn" id="langToggle">${t("lang")}</button>
        </header>
        <div class="fallback">
          <h2>${t("profileNotFound")}</h2>
          <p>${t("profileNotFoundDesc")}</p>
          <a class="btn" href="/">${t("backHome")}</a>
        </div>
      </div>
    `;
    document.getElementById("langToggle").onclick = () => setLang(lang === "ar" ? "en" : "ar");
  }

  function renderProfile(profile) {
    const name = profile.displayName || profile.name || profile.username || "User";
    const username = profile.username ? `@${profile.username}` : "";
    const bio = profile.bio || profile.about || "";
    const avatar = profile.avatarUrl || profile.photoUrl || "";

    app.innerHTML = `
      <div class="container">
        <header>
          <div class="logo">Nexa<span>.</span></div>
          <button class="lang-btn" id="langToggle">${t("lang")}</button>
        </header>
        <div class="profile-card">
          ${avatar ? `<img class="avatar" src="${avatar}" alt="" />` : `<div class="avatar"></div>`}
          <div class="display-name">${escapeHtml(name)}</div>
          ${username ? `<div class="username">${escapeHtml(username)}</div>` : ""}
          ${bio ? `<div class="bio">${escapeHtml(bio)}</div>` : ""}
          <a class="btn" href="${config.latestApkUrl || "#"}">${t("download")}</a>
        </div>
        <footer>© Nexa</footer>
      </div>
    `;
    document.getElementById("langToggle").onclick = () => setLang(lang === "ar" ? "en" : "ar");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function render() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    const profileId = getProfileId();

    if (!profileId) {
      renderHome();
      return;
    }

    app.innerHTML = `<div class="loading">${t("loading")}</div>`;

    const profile = await fetchProfile(profileId);
    if (profile) {
      renderProfile(profile);
    } else {
      renderFallback();
    }
  }

  render();
})();
