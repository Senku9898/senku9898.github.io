// ============================================================
// Nexa Public Website Configuration
// Edit this file when the backend public profile endpoint is ready.
// ============================================================
window.NEXA_CONFIG = {
  // Public, read-only profile API base URL (no auth required)
  // Final request will be: `${profileApiBase}/${profileId}`
  // Leave empty until the backend endpoint is available.
  profileApiBase: "",

  // Fallback download URL (GitHub Releases)
  latestApkUrl: "https://github.com/Senku9898/nexa/releases/latest/download/nexa.apk",

  // Version manifest URL
  versionManifestUrl: "https://senku9898.github.io/version.json"
};
