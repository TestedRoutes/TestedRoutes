/**

 * Matches SiteHeader.jsx active-nav rules for static HTML headers.

 * Run after <header> is in the DOM.

 */

(function () {

  function getPrimaryNavSlug() {

    var pathname = (window.location.pathname || "").replace(/\\/g, "/");

    var pathOnly = pathname.split("?")[0].split("#")[0];

    if (pathOnly === "/" || pathOnly === "" || /\/index\.html$/i.test(pathOnly)) {

      return "home";

    }

    var parts = pathOnly.split("/").filter(function (p) {

      return p;

    });

    var last = parts.length ? parts[parts.length - 1] : "";

    if (!last || /^index\.html$/i.test(last)) {

      return "home";

    }

    if (last === "destinations.html" || last === "destinations") return "destinations";
    if (last === "guides.html" || last === "guides") return "guides";
    if (last === "inspire.html" || last === "inspire") return "inspire";
    if (last === "inspire-story.html" || last === "inspire-story") return "inspire";
    if (last === "about.html" || last === "about") return "about";
    // Sub-pages (e.g. /guides/trift-bridge-from-zurich)
    if (parts.length >= 2 && parts[parts.length - 2] === "guides") return "guides";
    return null;

  }



  function hrefToSlug(href) {

    if (!href) return null;

    var h = href.split("?")[0].split("#")[0];

    if (/index\.html$/i.test(h)) return "home";

    if (/destinations\.html$/i.test(h)) return "destinations";

    if (/guides\.html$/i.test(h)) return "guides";

    if (/inspire\.html$/i.test(h)) return "inspire";

    if (/inspire-story\.html$/i.test(h)) return "inspire";

    if (/about\.html$/i.test(h)) return "about";

    return null;

  }



  function primaryNavLinkClass(slug, active) {

    var isActive = active === slug;

    if (isActive) {

      return "font-semibold text-slate-900 underline decoration-slate-800/35 decoration-1 underline-offset-[6px]";

    }

    return "font-normal text-slate-600 hover:text-slate-900";

  }



  function logoLinkClassName(active) {

    var base = "flex shrink-0 items-center border-b-2 border-transparent";

    if (active === "home") {

      return base + " border-slate-900/35";

    }

    return base;

  }



  function apply() {

    var nav = document.querySelector('header nav[aria-label="Primary"]');

    if (!nav) return;

    var active = getPrimaryNavSlug();

    var links = nav.querySelectorAll("a[href]");

    links.forEach(function (a) {

      var slug = hrefToSlug(a.getAttribute("href"));

      if (!slug) return;

      if (slug === "home") {

        a.className = logoLinkClassName(active);

        if (active === "home") {

          a.setAttribute("aria-current", "page");

        } else {

          a.removeAttribute("aria-current");

        }

        return;

      }

      a.className = primaryNavLinkClass(slug, active);

      if (active === slug) {

        a.setAttribute("aria-current", "page");

      } else {

        a.removeAttribute("aria-current");

      }

    });

  }



  if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", apply);

  } else {

    apply();

  }

})();

