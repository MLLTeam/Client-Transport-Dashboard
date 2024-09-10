async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");

  let myLatlng = { lat: 5.6037, lng: -0.1870 }; // Default to Accra
  const kumasiLatlng = { lat: 6.6885, lng: -1.6244 }; // Kumasi coordinates

  // Try to get the user's current location
  if (navigator.geolocation) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      myLatlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
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
    mapTypeId: 'roadmap',
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

  // Add markers for current location and Kumasi
  const startMarker = new AdvancedMarkerElement({
    map: map,
    position: myLatlng,
    title: "Your Location",
  });

  const endMarker = new AdvancedMarkerElement({
    map: map,
    position: kumasiLatlng,
    title: "Kumasi",
  });

  // Calculate and display route
  const request = {
    origin: myLatlng,
    destination: kumasiLatlng,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);

      // Display distance and duration
      const route = result.routes[0];
      console.log(route)
      const distanceElement = document.createElement("div");
      distanceElement.style.padding = "5px";
      distanceElement.style.backgroundColor = "white";
      distanceElement.style.marginTop = "10px";
      distanceElement.innerHTML = `Distance: ${route.legs[0].distance.text}<br>Duration: ${route.legs[0].duration.text}`;
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(distanceElement);
    }
  });
}

initMap();