googleGeocoding = {
  geocoder: new google.maps.Geocoder(),

  convert: function(queryToConvert) {
    this.conversionFetch(queryToConvert)
    .then(this.conversionFetchSucceeded)
    .catch(this.conversionFetchFailed);
  },

  conversionFetch: function(queryToConvert) {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({"address": queryToConvert}, function(results, status) {
        status === "OK" ? resolve(results) : reject(status);
      });
    });
  },

  conversionFetchFailed: function(status) {
    console.error(`Google Geocoding API status: ${status}.`);
  },
  
  conversionFetchSucceeded: function(results) {
    console.log("Google Geocoding API status: OK.");
    userLocation.setCoordinates(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    userLocation.googlePlaceID = results[0].place_id;
    userLocation.googleFormattedAddress = results[0].formatted_address;
    foursquare.recommend();
    ui.setSearchText(userLocation.googleFormattedAddress);
  },
};

googleMaps = { //TODO
  $wrapper: ui.$wrapper_map,
  options: {
    //TODO
  },
  setCenter: function(newLatitude, newLongitude) {
    //TODO
  },
  setZoom: function(newZoom) {
    //TODO
  },
  setMarker: function(latitude, longitude) {
    //TODO
  },
  activeMarker: null,
  removeMarker: function() {
    //TODO
  },
};