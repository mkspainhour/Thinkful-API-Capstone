const userLocation = {
  latitude: null,
  longitude: null,
  setCoordinates: function (newLatitude, newLongitude) {
    this.latitude = newLatitude;
    this.longitude = newLongitude;
  },
  nativelyGeolocate: function () {
    ui.enableGeolocatingButtonAnimation();
    ui.disableSearchField();
    ui.setSearchFieldText("Locating...");
    navigator.geolocation.getCurrentPosition(
      function success(foundPosition) {
        userLocation.setCoordinates(foundPosition.coords.latitude, foundPosition.coords.longitude);
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
            ui.searchFeedback("Unfortunately, denying permission to geolocate disables the feature until the app is refreshed.");
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
  if (featureFlags.deviceHasNativeGeolocation == false) {
    console.warn("User can not geolocate natively. Hiding Geolocate User button in the search view.");
    ui.$button_geolocateUser.hide();
  }
  ui.$activeView = ui.$view_welcome;
  googleMaps.initializeVenueMap();
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
    ui.$button_geolocateUser.blur();
    ui.disableClearSearchTextButton();
    userLocation.nativelyGeolocate();
  });
  //Search View, Search Form
  ui.$form_search.on("submit", function(event) {
    event.preventDefault(); //To prevent the dreaded page refresh problem
    ui.disableGeolocationButton();
    ui.disableSearchField();
    let searchTerms = ui.$input_search.val();
    //The search terms must not be blank and must include at least a character or digit
    if (searchTerms.length > 0 && searchTerms.match(/[\w\d]/g) && googleMaps.previousSearchTerms != searchTerms) {
      googleMaps.geocode(searchTerms);
    }
    else {
      ui.enableGeolocationButton();
      ui.enableSearchField();
    }
  });
  //Search View, Search Field
  ui.$input_search.on("input", function() {
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
  //Venue Details View, Back To Results Button
  ui.$button_backToResults.on("click", function () {
    ui.moveToSearchView();
  });
  //Venue Details View, See On Foursquare Button
  ui.$button_seeOnFoursquare.on("click", function () {
    window.open(ui.currentVenueFoursquareLink, "_blank");
  });
}