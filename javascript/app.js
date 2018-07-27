const session = { //Complete
  latitude: null,
  longitude: null,
  googlePlaceID: null,
  formattedAddress: null,
  setCoordinates: function (newLatitude, newLongitude) { //Complete
    this.latitude = newLatitude;
    this.longitude = newLongitude;
  },
  nativelyGeolocate: function () {
    ui.setSearchText("Locating...");
    navigator.geolocation.getCurrentPosition(
      function success(position) {
        session.setCoordinates(position.coords.latitude, position.coords.longitude);
        googleMapsAPI.geocode(session.latitude.toString() + "," + session.longitude.toString());
      },
      function failure(PositionError) {
        ui.setSearchText("Geolocation prevented.");
        console.error("Native geolocation error: " + PositionError.message);
      }, { // Options
        timeout: 10000, // 10 seconds
        maximumAge: 60000 // 1 minute
      }
    );
  }
};





//Entry Point Function
$(function entryPoint() {
  startup();
  configureInitialEventListeners();
});

function startup() {
  if (sessionFlags.deviceHasNativeGeolocation == false) {
    console.warn("User can not geolocate natively. Hiding button.");
    ui.$button_geolocateUser.hide();
  }
  ui.$activeView = ui.$view_welcome;
  googleMapsAPI.setupMap();
}

function configureInitialEventListeners() {
  //Welcome View, Let's Get Started button
  ui.$button_letsGetStarted.on("click", function () {
    ui.moveToSearchView();
  });

  //Search View, Geolocate User button
  ui.$button_geolocateUser.on("click", function () {
    session.nativelyGeolocate();
  });

  //Search View, Submit Search button
  ui.$button_submitSearch.on("click", function () {
    ui.submitButtonClicked();
  });

  //Venue Details View, Back button
  ui.$button_backToResults.on("click", function () {
    ui.moveToSearchView();
  });

  ui.$button_seeOnFoursquare.on("click", function (event) {
    window.open(ui.currentVenueFoursquareLink, "_blank");
  });
}