/* Theme handling: follow the system light/dark setting by default,
   remember a manual override in localStorage. Applied to <html data-theme>. */
(function () {
  var STORAGE_KEY = "theme";
  var memoryOverride = null; // manual pick survives one page when storage is blocked
  var query = window.matchMedia("(prefers-color-scheme: dark)");

  function systemTheme() {
    return query.matches ? "dark" : "light";
  }

  function currentTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || systemTheme();
    } catch (e) {
      return systemTheme();
    }
  }

  // The sun/moon icons are aria-hidden, so the label must carry the state:
  // which theme is active and what activating the button will select.
  function labelFor(theme) {
    return theme === "dark"
      ? "Switch to light theme (current theme: dark)"
      : "Switch to dark theme (current theme: light)";
  }

  function updateToggleLabels(theme) {
    var label = labelFor(theme);
    var buttons = document.querySelectorAll(".theme-toggle");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-label", label);
      buttons[i].setAttribute("title", label);
    }
  }

  function announce(theme) {
    updateToggleLabels(theme);
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    announce(theme);
  }

  // Applied by an inline script in <head> before first paint; re-apply
  // here so the attribute is also correct when JS was deferred/absent.
  apply(currentTheme());

  function wire(button) {
    if (button.dataset.wired) return;
    button.dataset.wired = "true";
    // Wired after the initial announce (which fires before <body> exists),
    // so set the current state label now.
    updateToggleLabels(document.documentElement.getAttribute("data-theme") || "light");
    button.addEventListener("click", function () {
      var theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", theme);
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        /* private mode: remember the choice for this page */
        memoryOverride = theme;
      }
      announce(theme);
    });
  }

  window.initThemeToggle = function (button) {
    if (button) wire(button);
  };

  // Self-wire so load order (defer/async/inline) never matters.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      var button = document.querySelector(".theme-toggle");
      if (button && !button.dataset.wired) wire(button);
    });
  }

  // Follow live system changes while no manual override is stored.
  var onSystemChange = function () {
    if (memoryOverride) return; // manual selection wins over an OS flip
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* storage blocked: nothing was persisted, so follow the system */
    }
    if (!stored) apply(systemTheme());
  };
  if (query.addEventListener) {
    query.addEventListener("change", onSystemChange);
  } else if (query.addListener) {
    query.addListener(onSystemChange); // Safari < 14
  }
})();
