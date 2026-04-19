(function () {
  var el = document.getElementById("route-map");
  if (!el) return;

  var key = window.SITE_CONFIG && window.SITE_CONFIG.googleMapsKey;
  var fallback = el.dataset.fallbackHref;

  if (!key || key === "YOUR_GOOGLE_MAPS_API_KEY") {
    // No key yet — show an OpenStreetMap fallback with a link
    el.innerHTML =
      '<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=8.334%2C46.710%2C8.390%2C46.745&layer=mapnik&marker=46.7298%2C8.3719" width="100%" height="320" style="border:0;display:block" loading="lazy" title="Map"></iframe>' +
      (fallback ? '<a href="' + fallback + '" target="_blank" rel="noopener noreferrer" class="block bg-white px-3 py-1.5 text-[10px] text-slate-400 hover:text-slate-600">View route in Google Maps ↗</a>' : "");
    return;
  }

  var params = new URLSearchParams({
    key: key,
    origin: el.dataset.origin,
    destination: el.dataset.destination,
    mode: el.dataset.mode || "walking",
  });
  if (el.dataset.waypoints) params.set("waypoints", el.dataset.waypoints);

  var iframe = document.createElement("iframe");
  iframe.src = "https://www.google.com/maps/embed/v1/directions?" + params.toString();
  iframe.width = "100%";
  iframe.height = "320";
  iframe.style.cssText = "border:0;display:block";
  iframe.loading = "lazy";
  iframe.title = "Route map";
  iframe.allowFullscreen = true;

  var link = document.createElement("a");
  link.href = fallback || "#";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "block bg-white px-3 py-1.5 text-[10px] text-slate-400 hover:text-slate-600";
  link.textContent = "View route in Google Maps ↗";

  el.innerHTML = "";
  el.appendChild(iframe);
  if (fallback) el.appendChild(link);
})();
