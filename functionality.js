const textField_locationQuery = document.getElementById("textField-locationQuery");
const button_submitLocationQuery = document.getElementById("button-submitLocationQuery");
const wrapper_map = document.getElementById("wrapper-map");

const geocoder = new google.maps.Geocoder();
let map;
const mapMarkers = [];

const userLocation = {
  name: null,
  latitude: null,
  longitude: null
};



document.addEventListener("DOMContentLoaded", function entryPoint() {
  initializeApp();
});



function initializeApp() {
  //Event Listeners
  button_submitLocationQuery.addEventListener("click", function() {
    if (textField_locationQuery.value != null) {
      setCoordinatesFromQuery(textField_locationQuery.value);
    }
  });

  //Map
  map = new google.maps.Map(wrapper_map, {
    center: { lat: 50, lng: 50 },
    zoom: 5
  });
}

function setCoordinatesFromQuery(query) {
  geocoder.geocode({"address": query}, function(results, status) {
    if (status == "OK") {
      userCoordinates.latitude = results[0].geometry.location.lat(); 
      userCoordinates.longitude = results[0].geometry.location.lng();

      //TEMP: Formatted Result Output
      const formattedResults = {
        "[1] Formatted Address": results[0].formatted_address,
        "[2] Location Type(s)": results[0].types.join(", "),
        "[3] Latitude": results[0].geometry.location.lat(),
        "[4] Longitude": results[0].geometry.location.lng()
      }
      console.table(formattedResults);
    }
    else {
      console.log(`Unexpected Geocoder status: ${status}`);
      switch(results) {
        case "ZERO_RESULTS":
          break;
        case "OVER_QUERY_LIMIT":
          break;
        case "REQUEST_DENIED":
          break;
        case "INVALID_REQUEST":
          break;
        case "UNKNOWN_ERROR":
          break;
        case "ERROR":
          break;
      }
    }
  });
}