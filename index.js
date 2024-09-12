async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");

  let myLatlng = { lat: 5.6037, lng: -0.1870 }; // Default to Accra
  const tarkwaLatlng = { lat: 5.3153, lng: -1.9906 }; // Tarkwa mining site coordinates

  // Try to get the user's current location
  if (navigator.geolocation) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      myLatlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    } catch (error) {
      console.error("Error getting current location:", error);
    }
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: myLatlng,
    mapId: "DEMO_MAP_ID",
    mapTypeId: "roadmap",
    disableDefaultUI: true, // Disable all default controls
    zoomControl: true, // Enable zoom control
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM,
    },
  });

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true, // We'll add our own markers
  });

  // Add custom "My Location" button
  const locationButton = document.createElement("button");
  locationButton.textContent = "My Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationButton);

  locationButton.addEventListener("click", () => {
    map.setCenter(myLatlng);
    map.setZoom(15);
  });



  // SVG truck icon for current location marker
  const truckSvg = {
    path: "M528 0C554.5 0 576 21.5 576 48L576 368c0 26.5-21.5 48-48 48l-16 0c0 53-43 96-96 96s-96-43-96-96l-128 0c0 53-43 96-96 96s-96-43-96-96l-32 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l0-64 0-32 0-18.7c0-17 6.7-33.3 18.7-45.3L64 114.7c12-12 28.3-18.7 45.3-18.7L160 96l0-48c0-26.5 21.5-48 48-48L528 0zM160 160l-50.7 0L32 237.3l0 18.7 128 0 0-96zM464 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm-368-48a48 48 0 1 0 0 96 48 48 0 1 0 0-96z",
    fillColor: "#1E90FF",
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: "#000000",
    scale: 0.05,
    anchor: new google.maps.Point(566, 20),
  };


  // Marker for current location (truck icon)
  const startMarker = new google.maps.Marker({
    map: map,
    position: myLatlng,
    title: "Your Location",
    icon: truckSvg,
  });

  // Default marker for Tarkwa mining site
  const endMarker = new google.maps.Marker({
    map: map,
    position: tarkwaLatlng,
    title: "Tarkwa Mining Site",
  });

  // Calculate and display the route
  const request = {
    origin: myLatlng,
    destination: tarkwaLatlng,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);

      const route = result.routes[0];
      const distanceElement = document.createElement("div");
      distanceElement.style.padding = "5px";
      distanceElement.style.backgroundColor = "white";
      distanceElement.style.marginTop = "10px";
      distanceElement.style.color = "black";
      distanceElement.innerHTML = `Distance: ${route.legs[0].distance.text}<br>Duration: ${route.legs[0].duration.text}`;
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(distanceElement);
    }
  });
}

initMap();
