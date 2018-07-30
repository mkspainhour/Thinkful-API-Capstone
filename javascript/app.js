const featureFlags = {
  deviceHasNativeGeolocation: ("geolocation" in window.navigator)
}

const userLocation = {
  latitude: null,
  longitude: null,
  setCoordinates: function (newLatitude, newLongitude) {
    this.latitude = newLatitude;
    this.longitude = newLongitude;
  },
  nativelyGeolocate: function () {
    ui.$button_geolocateUser.blur();
    ui.enableGeolocatingButtonAnimation();
    ui.disableSearchField();
    ui.setSearchFieldText("Locating...");

    navigator.geolocation.getCurrentPosition(
      function success(foundPosition) {
        userLocation.setCoordinates(foundPosition.coords.latitude, foundPosition.coords.longitude);
        //Outbound
        googleMaps.geocode( userLocation.latitude.toString()+","+userLocation.longitude.toString() );
      },
      function failure(PositionError) {

        ui.setSearchFieldText("Geolocation prevented.");
        ui.disableGeolocatingButtonAnimation();
        ui.enableSearchField();

        switch(PositionError.code) {
          case 3: //Timeout
            alert("Geolocating you is taking longer than it should. Try again in a bit. The problem may have cleared itself up by then.");
            console.error("Native geolocation timed out.");
            break;
          case 1: //Permission Denied
            ui.$button_geolocateUser.hide();
            ui.setSearchFeedback("Unfortunately, denying permission to geolocate disables the feature until the app is refreshed.");
            break;
          case 2: //Position Unavailable
            alert("Something went wrong trying to geolocate you. Not sure what's going on, really.");
            break;
        }
        //console.error("Native geolocation error: " + PositionError.message);
      }, 
      { // Options
        timeout: 15000, // 15 seconds
        maximumAge: 60000 // 1 minute
      }
    );
  }
};



//Entry Point Function
$(function entryPoint() {
  ui.$activeView = ui.$view_welcome;
  ui.disableClearSearchTextButton(); //Should begin hidden
  ui.$wrapper_searchResults.hide(); //So that they can be faded in once fetched
  ui.$text_searchMessage.hide(); //Should only be displayed when there's something to communicate to the user
  
  googleMaps.initializeVenueMap();
  parseFeatureFlags();
  ui.configureInitialEventListeners();
});

function parseFeatureFlags() {
  if (featureFlags.deviceHasNativeGeolocation == false) {
    console.warn("User can not geolocate natively. Hiding Geolocate User button in the search view.");
    ui.$button_geolocateUser.hide();
  }
}