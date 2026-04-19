(function () {
  var el = document.getElementById("route-map");
  if (!el) return;

  var key = window.SITE_CONFIG && window.SITE_CONFIG.googleMapsKey;

  if (!key || key === "YOUR_GOOGLE_MAPS_API_KEY") {
    el.innerHTML =
      '<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=8.334%2C46.710%2C8.390%2C46.745&layer=mapnik&marker=46.7298%2C8.3719" width="100%" height="320" style="border:0;display:block" loading="lazy"></iframe>';
    return;
  }

  el.style.height = "320px";

  window._ptInitMap = function () {
    var originLat = parseFloat(el.dataset.originLat);
    var originLng = parseFloat(el.dataset.originLng);
    var destLat   = parseFloat(el.dataset.destLat);
    var destLng   = parseFloat(el.dataset.destLng);

    var origin = { lat: originLat, lng: originLng };
    var dest   = { lat: destLat,   lng: destLng   };

    var map = new google.maps.Map(el, {
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
    });

    // Fit bounds to show both points with padding
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend(dest);
    map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });

    // Direct line
    new google.maps.Polyline({
      map: map,
      path: [origin, dest],
      strokeColor: "#2f6b7a",
      strokeWeight: 3,
      strokeOpacity: 0.85,
    });

    // Start dot at origin
    new google.maps.Marker({
      map: map,
      position: origin,
      icon: {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="6" fill="#2f6b7a" stroke="white" stroke-width="2"/></svg>'
        ),
        scaledSize: new google.maps.Size(16, 16),
        anchor: new google.maps.Point(8, 8),
      },
    });

    // PT pin at destination
    var ptSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="62" viewBox="0 0 52 62">' +
      '<path d="M26 0C11.64 0 0 11.64 0 26c0 19.5 26 36 26 36S52 45.5 52 26C52 11.64 40.36 0 26 0z" fill="#1a1816"/>' +
      '<circle cx="26" cy="25" r="18" fill="#1a1816" stroke="white" stroke-width="2.5"/>' +
      '<text x="26" y="31" text-anchor="middle" font-family="Georgia,serif" font-size="14" font-weight="bold" fill="white" letter-spacing="1.5">PT</text>' +
      '</svg>';

    new google.maps.Marker({
      map: map,
      position: dest,
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
