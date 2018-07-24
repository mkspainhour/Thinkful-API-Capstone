const userLocation = {
  latitude: null,
  longitude: null,
  googlePlaceID: null,
  setCoordinates: function(newLatitude, newLongitude) {
    this.latitude = newLatitude;
    this.longitude = newLongitude;
  },
  getCoordinates: function() {
    return {
      latitude: this.latitude,
      longitude: this.longitude
    };
  }
};

//Entry Point Function
$(function entryPoint() {
  startup();
  configureEventListeners();
});

function startup() {
  if (!sessionFlags.deviceHasNativeGeolocation) {
    console.warn("User can not geolocate natively.");
  }
  ui.$activeView = ui.$view_welcome;
  if(!sessionFlags.deviceHasNativeGeolocation) {
    ui.$button_geolocateUser.hide();
  }
}

function configureEventListeners() {

  ui.$button_letsGetStarted.on("click", function() {
    if (!sessionFlags.deviceHasNativeGeolocation) {
      ui.$button_geolocateUser.hide();
    }
    ui.moveToView(ui.$view_search);
  });

  ui.$button_geolocateUser.on("click", () => {
    ui.setSearchText("Locating...");
    navigator.geolocation.getCurrentPosition(
      function success(position) {
        userLocation.setCoordinates(position.coords.latitude, position.coords.longitude);
        googleGeocoding.convert(userLocation.latitude.toString() + "," + userLocation.longitude.toString())
      },
      function failure(PositionError) {
        alert("Denied: " + PositionError.message);
        ui.setSearchText("Could not locate.");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });

  ui.$button_submitSearch.on("click", () => {
    console.log(ui.$field_search.val());
    if (ui.$field_search.val() != "") {
      googleGeocoding.convert( ui.$field_search.val() );
    }
  });
}