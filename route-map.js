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
    var map = new google.maps.Map(el, {
      zoom: 8,
      center: { lat: 47.05, lng: 8.45 },
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
    });

    var origin = el.dataset.origin.replace(/\+/g, " ");
    var destination = el.dataset.destination.replace(/\+/g, " ");
    var waypointsRaw = el.dataset.waypoints || "";
    var mode = el.dataset.mode || "transit";

    var modeMap = {
      transit: google.maps.TravelMode.TRANSIT,
      walking: google.maps.TravelMode.WALKING,
      driving: google.maps.TravelMode.DRIVING,
    };

    var waypointList = waypointsRaw
      ? waypointsRaw.split("|").map(function (wp) {
          var parts = wp.split(",");
          return {
            location: new google.maps.LatLng(parseFloat(parts[0]), parseFloat(parts[1])),
            stopover: true,
          };
        })
      : [];

    var directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true,
      polylineOptions: { strokeColor: "#f97316", strokeWeight: 4, strokeOpacity: 0.85 },
    });

    new google.maps.DirectionsService().route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypointList,
        travelMode: modeMap[mode] || google.maps.TravelMode.TRANSIT,
      },
      function (result, status) {
        if (status !== "OK") return;
        directionsRenderer.setDirections(result);

        // Orange dot for start
        var startPos = result.routes[0].legs[0].start_location;
        new google.maps.Marker({
          map: map,
          position: startPos,
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="6" fill="#f97316" stroke="white" stroke-width="2"/></svg>'
            ),
            scaledSize: new google.maps.Size(16, 16),
            anchor: new google.maps.Point(8, 8),
          },
        });

        // PT marker at main waypoint (destination)
        var ptPos = waypointList.length > 0
          ? waypointList[0].location
          : result.routes[0].legs[result.routes[0].legs.length - 1].end_location;

        var ptSvg =
          '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="62" viewBox="0 0 52 62">' +
          '<path d="M26 0C11.64 0 0 11.64 0 26c0 19.5 26 36 26 36S52 45.5 52 26C52 11.64 40.36 0 26 0z" fill="#1a1816"/>' +
          '<circle cx="26" cy="25" r="18" fill="#1a1816" stroke="white" stroke-width="2.5"/>' +
          '<text x="26" y="31" text-anchor="middle" font-family="Georgia,serif" font-size="14" font-weight="bold" fill="white" letter-spacing="1.5">PT</text>' +
          '</svg>';

        new google.maps.Marker({
          map: map,
          position: ptPos,
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(ptSvg),
            scaledSize: new google.maps.Size(52, 62),
            anchor: new google.maps.Point(26, 62),
          },
          zIndex: 10,
        });
      }
    );
  };

  var script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=" + key + "&callback=_ptInitMap";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
})();
