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

  function announce(theme) {
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
