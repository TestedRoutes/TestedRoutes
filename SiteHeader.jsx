/**
 * Shared site header (React). Keep markup/classes in sync with static HTML:
 * destinations.html, guides.html, destinations/switzerland/index.html,
 * guides/*.html, inspire-story.html — same <header>/<nav> markup; static pages load nav-active.js
 * to mirror active-link rules below.
 * Loaded before other Babel bundles; exposes `SiteHeader` on window.
 */
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

function SiteHeader() {
  var active = getPrimaryNavSlug();
  var [menuOpen, setMenuOpen] = React.useState(false);

  var navLinks = [
    { slug: "destinations", href: "destinations.html", label: "Destinations" },
    { slug: "guides", href: "guides.html", label: "Guides" },
    { slug: "inspire", href: "inspire.html", label: "Inspire" },
    { slug: "about", href: "about.html", label: "About Me" },
  ];

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

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map(function (link) {
            return (
              <a
                key={link.slug}
                className={primaryNavLinkClass(link.slug)}
                href={link.href}
                aria-current={active === link.slug ? "page" : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Mobile hamburger button */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={function () { setMenuOpen(function (o) { return !o; }); }}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen ? (
        <div className="border-t border-slate-200/60 bg-[#f7f4ef] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map(function (link) {
              return (
                <a
                  key={link.slug}
                  href={link.href}
                  aria-current={active === link.slug ? "page" : undefined}
                  className={
                    "rounded-xl px-3 py-3 text-sm " +
                    (active === link.slug
                      ? "font-semibold text-slate-900 bg-slate-100"
                      : "font-normal text-slate-600 hover:bg-slate-100 hover:text-slate-900")
                  }
                  onClick={function () { setMenuOpen(false); }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}

window.SiteHeader = SiteHeader;
