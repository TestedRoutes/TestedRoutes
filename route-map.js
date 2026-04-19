(function () {
  var el = document.getElementById("route-map");
  if (!el) return;

  var key = window.SITE_CONFIG && window.SITE_CONFIG.googleMapsKey;

  if (!key || key === "YOUR_GOOGLE_MAPS_API_KEY") {
    el.style.overflow = "hidden";
    el.style.position = "relative";
    el.innerHTML =
      '<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=8.334%2C46.710%2C8.390%2C46.745&layer=mapnik&marker=46.7298%2C8.3719" width="100%" height="360" style="border:0;display:block;margin-bottom:-40px" loading="lazy"></iframe>';
    return;
  }

  el.style.height = "320px";

  window._ptInitMap = function () {
    // data-points="lat,lng|lat,lng|lat,lng" — 2 to 5 pipe-separated points
    var raw = (el.dataset.points || "").trim();
    var points = raw.split("|").map(function (p) {
      var parts = p.trim().split(",");
      return { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
    }).filter(function (p) { return !isNaN(p.lat) && !isNaN(p.lng); });

    if (points.length < 2) return;

    var map = new google.maps.Map(el, {
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
    });

    // Fit bounds around all points
    var bounds = new google.maps.LatLngBounds();
    points.forEach(function (p) { bounds.extend(p); });
    map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });

    // Line through all points
    new google.maps.Polyline({
      map: map,
      path: points,
      strokeColor: "#2f6b7a",
      strokeWeight: 3,
      strokeOpacity: 0.85,
    });

    // Small dot at every intermediate point (not first or last)
    for (var i = 1; i < points.length - 1; i++) {
      new google.maps.Marker({
        map: map,
        position: points[i],
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><circle cx="6" cy="6" r="4" fill="#2f6b7a" stroke="white" stroke-width="1.5"/></svg>'
          ),
          scaledSize: new google.maps.Size(12, 12),
          anchor: new google.maps.Point(6, 6),
        },
      });
    }

    // Start dot
    new google.maps.Marker({
      map: map,
      position: points[0],
      icon: {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="6" fill="#2f6b7a" stroke="white" stroke-width="2"/></svg>'
        ),
        scaledSize: new google.maps.Size(16, 16),
        anchor: new google.maps.Point(8, 8),
      },
    });

    // PT pin at last point
    var ptSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="62" viewBox="0 0 52 62">' +
      '<path d="M26 0C11.64 0 0 11.64 0 26c0 19.5 26 36 26 36S52 45.5 52 26C52 11.64 40.36 0 26 0z" fill="#1a1816"/>' +
      '<circle cx="26" cy="25" r="18" fill="#1a1816" stroke="white" stroke-width="2.5"/>' +
      '<text x="26" y="31" text-anchor="middle" font-family="Georgia,serif" font-size="14" font-weight="bold" fill="white" letter-spacing="1.5">PT</text>' +
      '</svg>';

    new google.maps.Marker({
      map: map,
      position: points[points.length - 1],
      icon: {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(ptSvg),
        scaledSize: new google.maps.Size(52, 62),
        anchor: new google.maps.Point(26, 62),
      },
      zIndex: 10,
    });
  };

  var script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=" + key + "&callback=_ptInitMap";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
})();
