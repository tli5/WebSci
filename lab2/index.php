<!DOCTYPE HTML>
<html>
<head>

<meta charset="UTF-8">
<title>Web Science Lab 1</title>
<!-- jquery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>

<!-- custom scripts -->
<script src="./js/weather.js"></script>

<!-- Bootstrap JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>

<!-- Bootstrap CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">

<!-- custom CSS -->
<link rel="stylesheet" href="./css/weather.css">

</head>

<body>

<!-- the weather forecast panel displaying daily/hourly weather information -->
<main id="weather-window" class="weather panel panel-default col-xs-6 col-xs-offset-3">
	<!-- the invisible template html element to be used by javascript to create new weather forecast sections -->
	<section id="template" class="">
		<!-- daily weather forecast will be displayed here -->
		<section id="daily-info-template" class="daily-info panel-body panel panel-default" data-toggle="collapse" href="#hourly-info-template" >
			<!-- the left part of forecast panel, displaying weather image, date and location -->
			<section class="basic-info col-xs-4 panel-body">
				<img alt="weather image" class="weather-image col-xs-12" src="./images/default-day.png"/>
				<p class="day col-xs-12">Tue</p>
				<p class="date col-xs-12">February 17th 2015</p>
				<p class="city col-xs-12">Troy, NY</p>
			</section>

			<!-- weather information displayed in a list group -->
			<section class="weather-info col-xs-8 panel-body">
				<section class="list-group">
				    <section class="list-group-item"> 
				    	<p class="Min-Temperature">Min-Temperature: 19</p>
				    	<sup >F°</sup>
				    </section>
				    <section class="max-temp-parent list-group-item"> 
				    	<p class="Max-Temperature">Max-Temperature: 19</p>
				    	<sup >F°</sup>
				    </section>
				    <section class="list-group-item"> 
				    	<p class="Visibility">Visibility: 19</p>
				    </section>
				    <section class="list-group-item"> 
				    	<p class="Wind-Speed">Wind Speed: 19</p>
				    </section>
				</section>
			</section>
		</section>

		<!-- hourly weather forecast, initially collapsed, will be as follows -->
		<section id="hourly-info-template" class="hourly-info collapse hourly-info well">
			<section class="panel-body panel panel-default">
				<!-- displaying weather image, date and time -->
				<section class="col-xs-4 panel-body">
					<img alt="image" class="col-xs-12 weather-image" src="./images/default-day.png"/>
					<p class="day col-xs-12">Tue</p>
					<p class="date col-xs-12">February 17th 2015</p>
					<p class="city col-xs-12">12:00:00</p>
				</section>

				<!-- displaying weather information -->
				<section class="col-xs-8 panel-body">
					<section class="list-group">
					    <section class="list-group-item"> 
					    	<p class="Temperature">Temperature: 19</p>
					    	<sup >F°</sup>
					    </section>
					    <section class="list-group-item"> 
					    	<p class="Visibility">Visibility: 19</p>
					    </section>
					    <section class="list-group-item"> 
					    	<p class="Wind-Speed">Wind Speed: 19</p>
					    </section>
					</section>
				</section>
			</section>
		</section>

	</section>


</main>




</body>

</html>