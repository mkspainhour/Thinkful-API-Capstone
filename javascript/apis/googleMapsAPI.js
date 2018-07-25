
googleMapsAPI = {
  mapOptions: {},
  activeMarker: null,
  setMapCenter: function(latitude, longitude) {
    //TODO
  },
  setMapZoom: function(newZoomLevel) {
    //TODO
  },
  setMapMarker: function(latitude, longitude) {
    //TODO
  },

  geocoder: new google.maps.Geocoder(),
  geocode: function(searchTerms) {
    this.convert(searchTerms)
    .then(this.conversionSucceeded)
    .catch(this.conversionFailed);
  },
  convert: function(searchTerms) {
    return new Promise((resolve, reject) => {

      this.geocoder.geocode( {"address": searchTerms},
      function(results, status) {
        status === "OK" ? resolve(results) : reject(status);
      });

    });
  },
  conversionFailed: function(status) {
    switch (status) {
      case "ZERO_RESULTS":
        ui.setSearchText("Zero results.");
        console.warn(`google.geocode() failed with status: "${status}".`);
        break;

      case "OVER_QUERY_LIMIT":
      case "REQUEST_DENIED":
      case "INVALID_REQUEST":
        console.error(`google.geocode() failed with status: "${status}".`);
        break;

      case "UNKNOWN_ERROR":
        ui.setSearchText("Google server error!");
        console.error(`google.geocode() failed with status: "${status}".`);
        break;

      case "ERROR":
        ui.setSearchText("Network error!");
        console.error(`google.geocode() failed with status: "${status}".`);
        break;
    }
  },
  conversionSucceeded: function(results) {
    console.log(`googleMapsAPI.geocode(searchTerms) succeeded!`);
    userLocation.setCoordinates( results[0].geometry.location.lat(), results[0].geometry.location.lng() );
    userLocation.googlePlaceID = results[0].place_id;
    userLocation.formattedAddress = results[0].formatted_address;
    ui.setSearchText( userLocation.formattedAddress );
    foursquareAPI.fetchRecommendationsAround(userLocation.latitude, userLocation.longitude);
  },
};