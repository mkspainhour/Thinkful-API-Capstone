const ui = {
  //State Variables
  $activeView: null,
  searchResultsScrollPosition: null,
  currentVenueFoursquareLink: null,

  //Value Containers
  fadeDuration: 250,

  //Welcome View component pointers
  $view_welcome: $("#js-view-welcome"),
  $button_letsGetStarted: $("#js-button-lets-get-started"),

  //Search View component pointers
  $view_search: $("#js-view-search"),
  $form_search: $("#js-form-search"),
  $button_geolocateUser: $("#js-button-geolocate-user"),
  $input_search: $("#js-input-search"),
  $button_clearSearchText: $("#js-button-clear-search-text"),
  $text_searchMessage: $("#js-text-search-message"),
  $button_submitSearch: $("#js-button-submit-search"),
  $wrapper_searchResults: $("#js-wrapper-search-results"),

  //Venue Detail View component pointers
  $view_venueDetails: $("#js-view-venue-details"),
  $button_backToResults: $("#js-button-back-to-results"),
  //Individual Venue Details
  $text_venueType: $("#js-text-venue-type"),
  $text_venueName: $("#js-text-venue-name"),
  $wrapper_venuePrice: $("#js-wrapper-venue-price"),
  $text_venuePrice: $("#js-text-venue-price"),
  $wrapper_venueHours: $("#js-wrapper-venue-hours"),
  $text_venueHours: $("#js-text-venue-hours"),
  $wrapper_venueRating: $("#js-wrapper-venue-rating"),
  $text_venueRating: $("#js-text-venue-rating"),
  $wrapper_venueWebsite: $("#js-wrapper-venue-website"),
  $text_venueWebsite: $("#js-text-venue-website"),
  $wrapper_venuePhoneNumber: $("#js-wrapper-venue-phone-number"),
  $text_venuePhoneNumber: $("#js-text-venue-phone-number"),
  $map_wrapper: $("#map-wrapper"),
  $text_venueAddress: $("#js-text-venue-address"),
  $wrapper_venueTemperature: $("#js-wrapper-venue-temperature"),
  $text_venueTemperature: $("#js-text-venue-temperature"),
  $wrapper_venuePrecipitation: $("#js-wrapper-venue-precipitation"),
  $text_venuePrecipitation: $("#js-text-venue-precipitation"),
  $button_seeOnFoursquare: $("#js-button-see-on-foursquare"),

  //UI Functions
  moveToSearchView: function () {
    this.$activeView.fadeOut(this.fadeDuration, () => {
      this.$activeView = this.$view_search;
      this.$activeView.fadeIn(this.fadeDuration);
      window.scroll(0, ui.searchResultsScrollPosition);
    });
  },

  moveToDetailsView: function (venue) {
    ui.searchResultsScrollPosition = window.scrollY;
    this.$activeView.fadeOut(this.fadeDuration, () => {
      this.$activeView = this.$view_venueDetails;
      window.scroll(0, 0);
      googleMapsAPI.setMapCenter(venue.latitude, venue.longitude);
      this.$activeView.fadeIn(this.fadeDuration);
    });
  },

  enableGeolocatingIcon: function () {
    this.$button_geolocateUser.children("img").attr("src", "resources/icons/locatingUser.svg");
  },

  disableGeolocatingIcon: function() {
    this.$button_geolocateUser.children("img").attr("src", "resources/icons/geolocateUser.svg");
  },

  enableClearSearchTextButton: function() {
    ui.$button_submitSearch.css("width", "36px");
    ui.$button_submitSearch.css("right", "6px");
    ui.$input_search.css("padding-right", "86px");
    //ui.$input_search.css("padding-right", "") TODO
    ui.$button_clearSearchText.show();
    ui.$input_search.focus();
  },

  disableClearSearchTextButton: function() {
    ui.$button_submitSearch.css("width", "48px");
    ui.$button_submitSearch.css("right", "0");
    ui.$input_search.css("padding-right", "40px");
    //ui.$input_search.css("padding-right", "") TODO
    ui.$button_clearSearchText.hide();
  },

  submitButtonClicked: function () {
    let searchTerms = this.$input_search.val();
    //The search terms must not be blank and must include at least a character or digit
    if (searchTerms.length > 0 && searchTerms.match(/[\w\d]/g) && googleMapsAPI.previousSearchTerms != searchTerms) {
      googleMapsAPI.geocode(searchTerms);
    }
  },

  setSearchText: function (newText) {
    this.$input_search.val(newText);
  },

  renderVenues: function () {
    let constructedVenueElements = [];
    for (let i = 0; i < foursquareAPI.fetchedVenues.length; i++) {
      let currentVenueElement =
        `<div id="${i}" class="search-result card">
        <p class="typography-overline left-align light">${foursquareAPI.fetchedVenues[i].category}</p>
        <p class="typography-compact left-align light">${foursquareAPI.fetchedVenues[i].name}</p>
        <img src="resources/icons/chevron.svg" class="svg-search-result-chevron" alt="More venue detail...">
      </div>`;
      constructedVenueElements.push(currentVenueElement);
    }
    this.$wrapper_searchResults.html(constructedVenueElements);
    this.addSearchResultEventListeners();
    this.disableGeolocatingIcon();
    this.$wrapper_searchResults.fadeIn(this.fadeDuration);
  },

  addSearchResultEventListeners: function () {
    $(".search-result").on("click", function (event) {
      selectedVenue = foursquareAPI.fetchedVenues[event.currentTarget.id];
      ui.$text_venueTemperature.html("Fetching...");
      nationalWeatherServiceAPI.getVenueTemperature(selectedVenue);
      foursquareAPI.getVenueDetails(selectedVenue);
    })
  },

  showVenueDetailsFor: function (venue) { //TODO: 
    this.$text_venueType.html(venue.category);
    this.$text_venueName.html(venue.name);

    if (venue.price) {
      this.$text_venuePrice.html(venue.price);
      this.$wrapper_venuePrice.show();
    } else {
      this.$wrapper_venuePrice.hide();
    }

    if (venue.hours) {
      this.$text_venueHours.html(venue.hours);
      this.$wrapper_venueHours.show();
    } else {
      this.$wrapper_venueHours.hide();
    }

    if (venue.rating) {
      this.$text_venueRating.html(venue.rating + "/10 from " + venue.votes + " ratings");
      this.$wrapper_venueRating.show();
    } else {
      this.$wrapper_venueRating.hide();
    }

    if (venue.website) {
      this.$text_venueWebsite.attr("href", venue.website);
      this.$text_venueWebsite.html(venue.website.replace(/(http:\/\/www.)|(https:\/\/www.)|(www.)/g, ""));
      this.$wrapper_venueWebsite.show();
    } else {
      this.$wrapper_venueWebsite.hide();
    }

    if (venue.phoneNumber) {
      this.$text_venuePhoneNumber.attr("href", "tel:" + venue.phoneNumber);
      this.$text_venuePhoneNumber.html(venue.phoneNumber);
      this.$wrapper_venuePhoneNumber.show();
    } else {
      this.$wrapper_venuePhoneNumber.hide();
    }

    if (venue.latitude && venue.longitude) {
      this.$map_wrapper.show();
      this.$text_venueAddress.attr("href", "https://www.google.com/maps/search/?api=1&query=" + venue.name + " " + venue.address[1]);
      this.$text_venueAddress.html(venue.address[0] + "<br>" + venue.address[1]);
    } else {
      this.$map_wrapper.hide();
    }

    this.$text_venueTemperature.html(venue.temperature);

    if (venue.foursquareURL) {
      this.$button_seeOnFoursquare.show();
      this.currentVenueFoursquareLink = venue.foursquareURL;
    } else {
      this.$button_seeOnFoursquare.hide();
    }

    ui.searchResultsScrollPosition = window.scrollY;
    ui.moveToDetailsView(venue);
  }
};