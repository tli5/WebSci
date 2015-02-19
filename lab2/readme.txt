Features:
 1. Geo-info feature: the web application collects geo coordinates from user's browser (upon permission granted). If collection fails, the geo coordinates will be set as RPI's coordinates. 
 Based on the longitude and latitude, two separate APIs will be accessed:
 	1. Google Geocoding API is accessed to do reverse geocoding, retrieving city and state names
 	2. forecast.io API is accessed to retrieve weather forecast

 2. Hourly/ Daily weather forecast: Initially the application displays the weather information of the following seven days. Clicking the first forecast panel can display the weather information of the rest of day (2-hours incremental)

references:
 icon site: http://www.freedesign4.me/icons/free-weather-icon-pngs/
 forecast.io API: developer.forecast.io
 Google Geocoding API: developers.google.com/maps/documentation/geocoding

