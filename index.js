// FCC Zipline - Local Weather
// Get local weather from OpenWeather API
// User story 1: See current local weather
// User story 2: Different bg or icon depending on weather
// User story 3: Push toggle between F/C.

/********************** Updated news, 04/17 *****************************/
// geolocation available in HTTPS only
// https://developers.google.com/web/updates/2016/04/geolocation-on-secure-contexts-only 
// Free OpenWeather API available in HTTP (Not HTTPS) only
// Therefore switched to Dark Sky API.


// Variable to location load priority
var betterLocationInfo = false;

// Function to retrieve proper location information. (OW location mapping is not as good)
function startIPInfoRequest(url) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            betterLocationInfo = true;
            var locationInfo = JSON.parse(xhr.responseText);
            loadLocationInfo(locationInfo);
        }
    };
    xhr.open("GET", url);
    xhr.send();
}

function processWeather (data) {
  // console.log(data);
  loadWeatherInfo(data);
}

function startOpenWeatherRequest(url) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url + '?callback=processWeather';
  
  document.head.appendChild(script);
  
  
  
  /*
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var weatherInfo = JSON.parse(xhr.responseText);
            loadWeatherInfo(weatherInfo);
        }
    };
    xhr.open("GET", url);
    xhr.send();
    */
}

function loadLocationInfo(json) {
  var city = json.city;
  var region = json.region;
  
  var location = document.getElementById('location');
  var locationText = document.createTextNode(city + ', ' + region);
  location.appendChild(locationText);
}

function loadWeatherInfo(json) {
  var background = '';
  var weatherIcon = json.currently.icon;
  var temperatureF = json.currently.temperature;
  var temperatureC = temperatureF - 32 * 5/9;
  /*
  var weatherId = json.weather[0].id;
  
  var temperatureK = json.main.temp;
  var locationName = json.name;
  var locationCountry = json.sys.country;
  var weatherDesc = json.weather[0].description;
  var weatherIcon = json.weather[0].icon;
  var weatherIconLink = "//openweathermap.org/img/w/" + json.weather[0].icon + ".png";
  
  var temperatureC = temperatureK - 273.15;
  var temperatureF = temperatureC * 9/5 + 32;
  */
  var location = document.getElementById('location');
  var desc = document.getElementById('desc');
  var icon = document.getElementById('icon');
  var temp = document.getElementById('temp');
  var scale = document.getElementById('scale');
  
  //var locationText = document.createTextNode(locationName + ', ' + locationCountry);
  //var descText = document.createTextNode(weatherDesc);
  //var iconImg = document.createElement('img');
 // iconImg.setAttribute('src', weatherIconLink);
  var tempText = document.createTextNode(temperatureF.toFixed());
 // console.log(temperatureF.toFixed());
  switch (weatherIcon) {
    case 'rain': background = '#99bfbf';
      break;
    case 'clear-day': background = '#add5f7';
      break;
    case 'clear-night': background = '#add57f';
      break;
    case 'snow': background = '#dedede';
      break;
    case 'sleet': background = '#7262b2';
      break;
    case 'partly-cloudy-day':
    case 'partly-cloudy-night': background = '#455473';
      break;
    case 'thunderstorm': background = '#585d70';
      break;
    //default: 
  }
  
  /*
  if(weatherId < 300) background = '#585D70'; // thunderstorm
  else if(weatherId < 400) background = '#17CCC0'; // drizzle
  else if(weatherId < 600) background = '#99BFBF'; // rain
  else if(weatherId < 700) background = '#DEDEDE'; // snow
  else if(weatherId < 800) background = '#CC8822'; // atmosphere 
  else if(weatherId == 800) background = '#ADD5F7'; // clear
  else if(weatherId < 900) background = '#455473'; // clouds
  else if(weatherId < 910) background = '#7262B2'; // extreme
  else if(weatherId < 1000) background = '#607361'; // additional
  */
  
  document.body.style.backgroundColor = background;
  /*
  if(!betterLocationInfo) {
    location.appendChild(locationText);
  }
  */
  
  
  //desc.appendChild(descText);
  //icon.appendChild(iconImg);
  temp.appendChild(tempText);
  
  scale.onclick = function() {
    if(this.children[0].classList.contains('show'))
      tempText.nodeValue = temperatureC.toFixed();
    else tempText.nodeValue = temperatureF.toFixed();
    
    this.children[0].classList.toggle('show');
    this.children[2].classList.toggle('show');
  };
}

if (navigator.geolocation) {   // this feature only works in https
  navigator.geolocation.getCurrentPosition(function(position) {
    
    var APIkey = "1bfb42f126c6d584e7e68ad5dd430a28"; // "57d838312d79616d164d84038a5908ef";
    var lat = '';
    var lon = '';
    var APIcall = '//api.darksky.net/forecast/'
        //"http://api.openweathermap.org/data/2.5/weather?"; // but this feature only works in http...
    var fullAPIcall = '';
    
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    fullAPIcall = APIcall + APIkey + '/' + lat + ',' + lon;
      //APIcall + "lat=" + lat + "&lon=" + lon + "&appid=" + API_key;
    
    startIPInfoRequest('//ipinfo.io/json');
    startOpenWeatherRequest(fullAPIcall);
  });
}
