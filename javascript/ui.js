const ui = {
  //State Variables
  $activeView: null,
  searchViewScrollPosition: null,
  currentVenueFoursquareLink: null,

  //Value Containers
  fadeDuration: 375,

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
  moveToSearchView: function() {
    this.$activeView.fadeOut( this.fadeDuration, () => {
      this.$activeView = this.$view_search;
      this.$activeView.fadeIn(this.fadeDuration);
      window.scroll(0, this.searchViewScrollPosition);
    });
  },

  moveToDetailsViewFor: function(venue) {

    this.searchViewScrollPosition = window.scrollY;

    this.$activeView.fadeOut(this.fadeDuration, () => {
      this.$activeView = this.$view_venueDetails;
      window.scroll(0, 0);
      googleMaps.setMapCenter(venue.latitude, venue.longitude); //Outbound
      this.$activeView.fadeIn(this.fadeDuration);
    });
  },

  enableGeolocatingButtonAnimation: function () {
    this.$button_geolocateUser.css("pointer-events", "none");
    this.$button_geolocateUser.children("img").attr("src", "resources/icons/locatingUser.svg");
  },

  disableGeolocatingButtonAnimation: function() {
    this.$button_geolocateUser.css("pointer-events", "auto");
    this.$button_geolocateUser.children("img").attr("src", "resources/icons/geolocateUser.svg");
  },

  enableGeolocationButton: function() {
    this.$button_geolocateUser.prop("disabled", false);
  },

  disableGeolocationButton: function() {
    this.$button_geolocateUser.prop("disabled", true);
  },

  enableSearchField: function() {
    this.$input_search.prop("disabled", false);
    this.$button_clearSearchText.prop("disabled", false);
    this.$button_submitSearch.prop("disabled", false);
  },

  disableSearchField: function() {
    this.$input_search.prop("disabled", true);
    this.$button_clearSearchText.prop("disabled", true);
    this.$button_submitSearch.prop("disabled", true);
  },

  enableClearSearchTextButton: function() {
    ui.$button_submitSearch.css("width", "36px");
    ui.$button_submitSearch.css("right", "6px");
    ui.$input_search.css("padding-right", "86px");
    ui.$button_clearSearchText.show();
    ui.$input_search.focus();
  },

  disableClearSearchTextButton: function() {
    ui.$button_submitSearch.css("width", "48px");
    ui.$button_submitSearch.css("right", "0");
    ui.$input_search.css("padding-right", "40px");
    ui.$button_clearSearchText.hide();
    ui.$input_search.focus();
  },

  setSearchFieldText: function(newText) {
    this.$input_search.val(newText);
    this.$input_search.get(0).setSelectionRange(0, 0); //Sets the cursor to the beginning of the input to maximize legibility of new text content
  },

  searchFeedback: function(newMessage) {
    ui.$text_searchMessage.show();
    ui.$text_searchMessage.html(newMessage);
    this.scrollToTopOfResults();
  },

  scrollToTopOfResults: function() {
    $("html").animate({
      scrollTop: 0
    }, 1000);
  },

  renderVenues: function(venuesArray) {
    let constructedVenueElements = [];
    for (let i = 0; i < venuesArray.length; i++) {
      let currentVenueElement =
        `<div id="${i}" class="search-result card">
        <h2 class="typography-overline light">${venuesArray[i].category}</h2>
        <p class="typography-compact light">${venuesArray[i].name}</p>
        <img src="resources/icons/chevron.svg" class="svg-search-result-chevron" alt="More venue detail...">
      </div>`;
      constructedVenueElements.push(currentVenueElement);
    }
    this.$wrapper_searchResults.html(constructedVenueElements);
    this.addSearchResultEventListeners();
    this.disableGeolocatingButtonAnimation();
    ui.enableSearchField();
    ui.enableClearSearchTextButton();
    this.$wrapper_searchResults.fadeIn(this.fadeDuration);
  },

  addSearchResultEventListeners: function () {
    $(".search-result").on("click", function (event) {
      selectedVenue = foursquare.fetchedVenues[event.currentTarget.id];
      ui.$text_venueTemperature.html("Fetching...");
      nationalWeatherService.getVenueTemperature(selectedVenue); //Outbound
      foursquare.getVenueDetails(selectedVenue); //Outbound
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
      this.$text_venueRating.html("Rated " + venue.rating + "/10 from " + venue.votes + " opinions");
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

    ui.searchViewScrollPosition = window.scrollY;
    ui.moveToDetailsViewFor(venue);
  }
};