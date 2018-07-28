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
        ui.disableGeolocatingIcon();

        switch(PositionError.code) {
          case 3: //Timeout
            alert("Geolocating you is taking longer than it should. Try again in a bit. The problem may have cleared itself up by then.");
            console.error("Native geolocation timed out.");
            break;
          case 1: //Permission Denied
            ui.$button_geolocateUser.hide();
            ui.setSearchMessage("Unfortunately, denying permission to geolocate you disables the feature until the app is refreshed.");
            break;
          case 2: //Position Unavailable
            alert("Something went wrong trying to geolocate you. Not sure what's going on, really.");
            break;
        }
        //console.error("Native geolocation error: " + PositionError.message);
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
  ui.disableClearSearchTextButton();
  ui.$wrapper_searchResults.hide(); //So that they can be faded in once fetched
  ui.$text_searchMessage.hide(); //Only visible when there's something to communicate
  configureInitialEventListeners();
});

function configureInitialEventListeners() {
  //Welcome View Button
  ui.$button_letsGetStarted.on("click", function () {
    ui.moveToSearchView();
  });
  //Search View, Geolocate User Button
  ui.$button_geolocateUser.on("click", function () {
    ui.disableClearSearchTextButton();
    userLocation.nativelyGeolocate();
  });
  //Search View, Search Form
  ui.$form_search.on("submit", function(event) {
    event.preventDefault(); //To prevent the dreaded page refresh problem
    ui.submitButtonClicked();
  });
  //Search View, Search Field
  ui.$input_search.on("input", function(event) {
    ui.$text_searchMessage.hide();
    if(ui.$button_clearSearchText.css("display", "none")) {
      ui.enableClearSearchTextButton();
    }
    if(ui.$input_search.val() == "") {
      ui.disableClearSearchTextButton();
    }
  });
  //Search View, Clear Search Text Button
  ui.$button_clearSearchText.on("click", function() {
    ui.$input_search.val("");
    ui.$text_searchMessage.hide();
    ui.disableClearSearchTextButton();
  });
  //Search View, Submit Search Button
  ui.$button_submitSearch.on("submit", function (event) {
    event.preventDefault();
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