window.SiteFooter = function SiteFooter() {
  return (
    <footer className="flex flex-col gap-4 border-t border-slate-200 py-8 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
      <p>© {new Date().getFullYear()} Pikelis Travel. All rights reserved.</p>
      <div className="flex items-center gap-4">
        <span>Contact</span>
        <span>Terms</span>
        <span>Privacy</span>
      </div>
    </footer>
  );
};
