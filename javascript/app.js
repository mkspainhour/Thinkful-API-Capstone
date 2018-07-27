const userLocation = {
  latitude: null,
  longitude: null,
  setCoordinates: function (newLatitude, newLongitude) {
    this.latitude = newLatitude;
    this.longitude = newLongitude;
  },
  nativelyGeolocate: function () {
    ui.setSearchText("Locating...");
    ui.enableGeolocatingIcon();
    navigator.geolocation.getCurrentPosition(
      function success(foundPosition) {
        userLocation.setCoordinates(foundPosition.coords.latitude, foundPosition.coords.longitude);
        googleMapsAPI.geocode( userLocation.latitude.toString()+","+userLocation.longitude.toString() );
      },
      function failure(PositionError) {
        ui.setSearchText("Geolocation prevented.");
        ui.$button_geolocateUser.hide();
        ui.disableGeolocatingIcon();
        console.error("Native geolocation error: " + PositionError.message);
      }, 
      { // Options
        timeout: 10000, // 10 seconds
        maximumAge: 60000 // 1 minute
      }
    );
  }
};



//Entry Point Function
$(function entryPoint() {
  if (sessionFlags.deviceHasNativeGeolocation == false) {
    console.warn("User can not geolocate natively. Hiding Geolocate User button in the search view.");
    ui.$button_geolocateUser.hide();
  }
  ui.$activeView = ui.$view_welcome;
  googleMapsAPI.initializeVenueMap();
  ui.$wrapper_searchResults.hide(); //So that they can be faded in once fetched
  configureInitialEventListeners();
});

function configureInitialEventListeners() {
  //Welcome View Button
  ui.$button_letsGetStarted.on("click", function () {
    ui.moveToSearchView();
  });

  //Search View, Geolocate User Button
  ui.$button_geolocateUser.on("click", function () {
    userLocation.nativelyGeolocate();
  });

  //Searc View, Submit Text Field
  ui.$input_search.on("submit", function(event) {
    event.preventDefault();
    ui.submitButtonClicked();
  });

  //Search View, Submit Search Button
  ui.$button_submitSearch.on("click", function () {
    ui.submitButtonClicked();
  });

  //Venue Details View, Back To Results Button
  ui.$button_backToResults.on("click", function () {
    ui.moveToSearchView();
  });

  //Venue Details View, See On Foursquare Button
  ui.$button_seeOnFoursquare.on("click", function (event) {
    window.open(ui.currentVenueFoursquareLink, "_blank");
  });
}