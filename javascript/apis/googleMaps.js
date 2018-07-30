
googleMaps = {
  activeMarker: null,
  map: null,
  initializeVenueMap: function () {
    this.map = new google.maps.Map(ui.$map_wrapper[0], {
      center: {
        lat: 1,
        lng: 1
      },
      zoom: 15,
      clickableIcons: false,
      draggable: false,
      fullscreenControl: false,
      keyboardShortcuts: false,
      mapTypeControl: false,
      streetViewControl: false,
      draggableCursor: "default",
      draggingCursor: "default",
      panControl: false,
      rotateControl: false,
      gestureHandling: "none",
      minZoom: 11,
      maxZoom: 19
    });
    this.activeMarker = new google.maps.Marker({
      position: this.map.getCenter(),
      map: this.map
    });
  },
  setMapCenter: function (latitude, longitude) {
    this.map.setCenter({
      lat: latitude,
      lng: longitude
    });
    this.activeMarker.setPosition(this.map.getCenter());
  },

  geocoder: new google.maps.Geocoder(),
  previousSearchTerms: null,
  geocode: function (searchTerms) {
    this.convert(searchTerms)
      .then(this.conversionSucceeded)
      .catch(this.conversionFailed);
  },
  convert: function (searchTerms) {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({"address": searchTerms},
        function (results, status) {
          status === "OK" ? resolve(results) : reject(status);
        });
    });
  },
  conversionFailed: function (status) {
    switch (status) {
      case "ZERO_RESULTS":
        ui.searchFeedback("Couldn't find any results for that location.");
        ui.enableGeolocationButton();
        ui.enableSearchField();
        break;

      case "OVER_QUERY_LIMIT":
      case "REQUEST_DENIED":
      case "INVALID_REQUEST":
        alert(`google.geocode() failed with status: "${status}".`);
        break;

      case "UNKNOWN_ERROR":
        alert(`Google server error! google.geocode() failed with status: "${status}".`);
        break;

      case "ERROR":
        alert(`Network error! google.geocode() failed with status: "${status}".`);
        break;
    }
  },
  conversionSucceeded: function (results) {
    console.log(`googleMaps.geocode(searchTerms) succeeded!`);
    googleMaps.previousSearchTerms = results[0].formatted_address;
    userLocation.setCoordinates(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    ui.setSearchFieldText( results[0].formatted_address );
    foursquare.fetchRecommendationsAround(userLocation.latitude, userLocation.longitude);
  },
};