import * as React from "react";

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
  if (last === "destinations.html") return "destinations";
  if (last === "guides.html") return "guides";
  if (last === "inspire.html") return "inspire";
  if (last === "inspire-story.html") return "inspire";
  if (last === "about.html") return "about";
  return null;
}

function primaryNavLinkClass(slug) {
  var active = getPrimaryNavSlug();
  var isActive = active === slug;
  if (isActive) {
    return "font-semibold text-slate-900 underline decoration-slate-800/35 decoration-1 underline-offset-[6px]";
  }
  return "font-normal text-slate-600 hover:text-slate-900";
}

function logoLinkClassName() {
  var active = getPrimaryNavSlug();
  var base = "flex shrink-0 items-center border-b-2 border-transparent";
  if (active === "home") {
    return base + " border-slate-900/35";
  }
  return base;
}

export default function SiteHeader() {
  var active = getPrimaryNavSlug();
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-[#f7f4ef]/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-6 text-sm text-slate-900"
        aria-label="Primary"
      >
        <a
          className={logoLinkClassName()}
          href="index.html"
          aria-current={active === "home" ? "page" : undefined}
        >
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-semibold uppercase tracking-[0.3em] text-slate-900">
              PIKELIS TRAVEL
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.4em] text-slate-500">
              since 2010
            </span>
          </span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          <a
            className={primaryNavLinkClass("destinations")}
            href="destinations.html"
            aria-current={active === "destinations" ? "page" : undefined}
          >
            Destinations
          </a>
          <a
            className={primaryNavLinkClass("guides")}
            href="guides.html"
            aria-current={active === "guides" ? "page" : undefined}
          >
            Guides
          </a>
          <a
            className={primaryNavLinkClass("inspire")}
            href="inspire.html"
            aria-current={active === "inspire" ? "page" : undefined}
          >
            Inspire
          </a>
          <a
            className={primaryNavLinkClass("about")}
            href="about.html"
            aria-current={active === "about" ? "page" : undefined}
          >
            About Me
          </a>
        </div>
      </nav>
    </header>
  );
}
