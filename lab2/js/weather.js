var city = ""; //global variable to hold the value of city name
var state = ""; //global variable to hold the value of state name

//trigger javascript functions once the page is loaded successfully
$(document).ready(function(){
	//initialize upon page gets loaded
	initialize();
});

//retrieve the city/state name according to latitude and longitude
function retrieveLocation(lat,lng) {
	$.ajax({
	  url: "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&result_type=locality&key=AIzaSyBji5eFrhrIrolGxjB8zY_GVR-qI1BVMrs",
	  dataType: 'json',
	  //success handler
	  success: function(data) {
	  	//set city and state name after parsing the formatted address
	  	if (data["results"][0]["formatted_address"] == undefined) {
	  		//give empty values as default in case such formatted address is not given
	  		city = "";
	  		state = "";
	  	} else {
	  		//parse the address and get city and state names
	  		addr = data["results"][0]["formatted_address"];
	  		addrArray = addr.split(",");
	  		city = addrArray[0];
	  		state = addrArray[1];
	  	}

	  	//get weather information
	  	checkWeather(lat, lng);
	  },

	  //error handler
	  error: function(jqXHR, textStatus, error){
	  	//give empty values as default
	  	city = "";
	  	state = "";

	  	//get weather information
	  	checkWeather(lat, lng);
	  }
	});
}

function initialize() {
	var lat; //latitude used for weather checking
	var lng; //longitude used for weather checking
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
        	lat = position.coords.latitude;
			lng = position.coords.longitude;
			retrieveLocation(lat, lng); 
			//checkWeather(lat, lng);
        });
        
    } else {
        alert("Geolocation is not supported by this browser. Setting position to RPI campus");
        lat = 42.730010;
        lng = -73.679726;
        retrieveLocation(lat, lng);
        //checkWeather(lat, lng);
    }

}

//checking weather information according to geo coordinates
function checkWeather(lat, lng) {
	$.ajax({
	  url: "https://api.forecast.io/forecast/18401c2cadcfead91dd5e2272085a4bf/"+lat+","+lng,
	  dataType: 'jsonp',
	  //success handler
	  success: function(data) {
	  	//date will be holding all the weather information, and will be used to modify html elements
	  	displayWeather(data);
	  },

	  //error handler
	  error: function(jqXHR, textStatus, error){
	  	var msg = "temperature data loading failed\n" + "status:" + textStatus;
	  	msg += "\nerror message:" + error;
	  	alert(msg);
	  }
	});
}

//processing weather information
function displayWeather(data) {
	//days and hours are different weather forecast data points per forecast.io API
	var days = data["daily"]["data"];
	var hours = data["hourly"]["data"];

	//create the first panel with today's information
	createElement(data["currently"], hours);

	//create the panels of the rest days
	for (var i = 1; i < days.length-1; i++) {
		createElement(days[i], null);
	}
}

function createElement(data, hours) {
	//associative arrays to associate each possible weather icon value to a weather image
	var images = {
		"clear-day" : "clear-day.png",
		"clear-night" : "clear-night.png",
		"rain" : "rain.png",
		"snow" : "snow.png",
		"sleet" : "sleet.png",
		"wind" : "wind-day.png",
		"wind-day" : "wind-day.png",
		"wind-night" : "wind-night.png",
		"fog" : "fog-day.png",
		"fog-day" : "fog-day.png",
		"fog-night" : "fog-night.png",
		"cloudy" : "cloudy.png",
		"partly-cloudy-day" : "partly-cloudy-day.png",
		"partly-cloudy-night" : "partly-cloudy-night.png"
	};

	//convert unix time into human readable time
	var unixTime = data["time"];
  	var date = toDate(unixTime);

  	//create jQuery DOM objects using the invisible template
  	var tmpNode = $("#template").clone();
  	var dailyNode = tmpNode.children('.daily-info').first();
  	var hourlyNode = tmpNode.children('.hourly-info').first();

  	//removing template related ids
  	tmpNode.removeAttr("id");
  	dailyNode.removeAttr("id");
  	hourlyNode.removeAttr("id");

  	//hourly forecast panels are created using template also
  	var tmpHourlyNode = hourlyNode.clone();
  	hourlyNode.remove(); //removing the template
  	hourlyNode = tmpHourlyNode;

  	//the href attribute to be used for Bootstrap data toggle
  	dailyNode.attr("href", ".hourly-info");

  	//adjust the html contents to display correct weather information
  	dayNode = dailyNode.find(".day").first();
  	dayNode.html(date["day"]);
  	dateNode = dailyNode.find(".date").first();
  	dateNode.html(date["month"] + " " + date["date"] + " " + date["year"]);
  	cityNode = dailyNode.find(".city").first();
  	cityNode.html(city + ", " + state);
  	imgNode = dailyNode.find(".weather-image").first();
  	var image = images[data["icon"]] == "undefined" ? "default-day.png" : images[data["icon"]];
  	var imageURL = "./images/" + image;

  	//set the image according to weather forecast
  	imgNode.attr("src", imageURL);

  	//daily forecast data points don't have hours data block. Thus different data points have to be treated differently
  	if (hours == null) {
  		minTmpNode = dailyNode.find(".Min-Temperature").first();
	  	minTmpNode.html("Min-Temperature: "+ data["temperatureMin"]);
	  	maxTmpNode = dailyNode.find(".Max-Temperature").first();
	  	maxTmpNode.html("Max-Temperature: "+ data["temperatureMax"]);
	} else {
		minTmpNode = dailyNode.find(".Min-Temperature").first();
	  	minTmpNode.html("Temperature: "+ data["temperature"]);
	  	maxTmpNode = dailyNode.find(".Max-Temperature").first();
	  	var tmpParent = dailyNode.find(".max-temp-parent").first();
	  	tmpParent.remove();
	}
  	
  	//changing contents of visibility and wind speed
  	visNode = dailyNode.find(".Visibility").first();
  	visNode.html("Visibility: "+ data["visibility"]);
  	windNode = dailyNode.find(".Wind-Speed").first();
  	windNode.html("Wind Speed: "+ data["windSpeed"]);
  	//adjusting hourly nodes
  	var initial = date["hours"];
  	for (var i = initial; (hours != null) && (i <= 24); i = i + 2) {
  		//get human readable time information
	  	unixTime = hours[i]["time"];
	  	date = toDate(unixTime);

	  	//adjust the html elements accordingly
  		dayNode = hourlyNode.find(".day").first();
	  	dayNode.html(date["day"]);
	  	dateNode = hourlyNode.find(".date").first();
	  	dateNode.html(date["month"] + " " + date["date"] + " " + date["year"]);
	  	cityNode = hourlyNode.find(".city").first();
	  	cityNode.html(date["hours"] + ":00:00" );
	  	imgNode = hourlyNode.find(".weather-image").first();
	  	image = images[hours[i]["icon"]] == "undefined" ? "default-day.png" : images[hours[i]["icon"]];
	  	imageURL = "./images/" + image;

	  	imgNode.attr("src", imageURL);

	  	//adjust weather information
	  	tempNode = hourlyNode.find(".Temperature").first();
	  	tempNode.html("Temperature: "+ hours[i]["temperature"]);
	  	visNode = hourlyNode.find(".Visibility").first();
	  	visNode.html("Visibility: "+ hours[i]["visibility"]);
	  	windNode = hourlyNode.find(".Wind-Speed").first();
	  	windNode.html("Wind Speed: "+ hours[i]["windSpeed"]);
	  	hourlyNode.appendTo(tmpNode);
	  	hourlyNode = hourlyNode.clone();
  	}

  	//if the current element being processed is not the panel to display today's info, then it shouldn't have data-toggle functionalities
	if (hours == null) {
		dailyNode.removeAttr("data-toggle");
		dailyNode.removeAttr("href");
	}

	tmpNode.appendTo($("#weather-window"));
}

//convert unix time to human readable time, and return an associative array
function toDate(time) {
	var months = [	"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"	];
	var days = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"];

	var date = new Date(time*1000);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var month = months[date.getMonth()];
	var year = date.getYear();
	var day = days[date.getDay()];
	var dateOfMonth = date.getDate();
	return {
		"date": dateOfMonth,
		"hours": hours,
		"minutes": minutes,
		"seconds": seconds,
		"month": month,
		"year": year + 1900,
		"day": day
	};
}