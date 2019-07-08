var getLocation = function() {
  if (navigator.geolocation) {
      // timeout at 60000 milliseconds (60 seconds)
      var options = {timeout: 60000};
      navigator.geolocation.getCurrentPosition(this.getPlaces, this.locationErrorHandler, options);
      console.log(this.getPlaces);
  } else {
      alert("Sorry, browser does not support geolocation!");
  }
}

getLocation.bind(this);

getLocation();