var tweets; //a global javascript array to keep track of the information from tweets.json
var map; //to display user profiles for the tweets with geo info
var marker; //only one marker is used at any time
var infowindow; //one infowindow at any given time allowed only

$(document).ready(function(){
	//initialize upon page gets loaded
	initialize();
});

function initialize() {
	//retrieve tweets through ajax
	retrieveTweets();

	//load google map
	loadMap();
}

//initialize google map with initial center at RPI
function loadMap(){
	var rpi = new google.maps.LatLng(42.72966,  -73.67919);
	var mapOptions = {
      zoom: 16,
      center: rpi
    };

    //canvas is where the map should be located at
    map = new google.maps.Map(document.getElementById('canvas'),
        mapOptions);
}

function retrieveTweets() {
	//using ajax to load the json file
	$.ajax({
	  url: "tweets.json",
	  dataType: 'json',
	  //success handler
	  success: function(data) {
	  	//after loading the initial 5 tweets and hashtags, animate them
	  	tweets = jQuery.makeArray(data);
	  	tweetIDs = loadTweets(tweets);
	  	tagIDs = loadHashTags(tweets);
	  	animateTweets(tweetIDs, tagIDs);
	  },

	  //error handler
	  error: function(jqXHR, textStatus, error){
	  	var msg = "json file loading failed\n" + "status:" + textStatus;
	  	msg += "\nerror message:" + error;
	  	alert(msg);
	  }
	});
}

//load the initial 5 tweets
function loadTweets(tweets) {
	var tweetIDs = []; //storing ids of tweet nodes
	//create 5 tweets through a for loop
	for (var i = 0; i < 5; i++) {
		tweetIDs[i] = reloadTweet(null); //passing in null node because there isn't one available yet
	}
	return tweetIDs; //returning the DOM elements IDs generated
}

//load the initial 5 hashtags
function loadHashTags(tweets) {
	var hashtagIDs = [];

	//create the initial 5 hashtags by loading contents using reloadTag()
	for (var i = 0; i < 5; i++) {
		hashtagIDs[i] = reloadTag(null); //passing in null to indicate first time loading the content
	}

	return hashtagIDs;
}

//load new content into the existing tag node
function reloadTag(tagNode) {
	this.tagNodeID = this.tagNodeID==undefined? 1 : this.tagNodeID+1; // to keep track of new tag nodes generated 
	if(tagNode == null) {
		//create tweet node using a hidden template
	    tagNode = $("#tag-template").clone();
		tagNode.removeClass("template");
		tagNode.attr("id", "tag-"+(this.tagNodeID));
	}
	
	//first call of this function should create a hashtag array
	if (this.taglist == undefined) {
		this.taglist = [];
		var index = 0; //to keep track of index to taglist
		for (var i = 0; i < tweets.length; i++) {
			var tweet = tweets[i];

			//if current tweet doesn't have any hashtag associated, simply continue to next iteration
			if (typeof(tweet["entities"]) == undefined|| typeof(tweet["entities"]["hashtags"]) == undefined || tweet["entities"]["hashtags"].length == 0) {
				continue;
			}

			var tags = tweet["entities"]["hashtags"];
			for (var j = 0; j < tags.length; j++) {
				this.taglist[index++] = "#"+tags[j]["text"]; 
			}
		}
	}

	var taglist = this.taglist;

	//using this.id to keep track of the underlying index to fetch data from hashtag list
	this.id = this.id==undefined? 0 : this.id+1;
	var id = this.id % taglist.length; // in case id reaches its maximum number
	

	//getting information from the tweet subarray
	var tagText = taglist[id];

	//adjust the hashtag element's text message
	tagNode.children('em').each(function() {
		$(this).html(tagText);

	});

	//attach the detached tagNode to its parent again
	tagNode.appendTo("#tags");
	return tagNode.attr("id");
}

//animate tweets and hashtags
function animateTweets(tweetIDs, tagIDs){
	var id1 = 0; //index of tweetIDs
	var id2 = 0; //index of tagIDs

	//set an interval of 3 seconds to animate the list
	setInterval(function(){ 
		//first make the tweet transparent, then slide up to free space
		//detach and adjust transparency after being re-appended to the parent
		$("#"+ tweetIDs[id1++%5]).fadeTo("fast", 0.0, function(){
			 $(this).slideUp(function(){
			 	$(this).detach();
			 	reloadTweet($(this)); //load new content into this node
			 	$(this).fadeTo("slow", 1.0);

			 });
		});

		//first make the hashtag transparent, then slide up to free space
		//detach and adjust transparency after being re-appended to the parent
		$("#"+ tagIDs[id2++%5]).fadeTo("fast", 0.0, function(){
			 $(this).slideUp(function(){
			 	$(this).detach();
			 	reloadTag($(this)); //load new content into this node
			 	$(this).fadeTo("slow", 1.0);

			 });
		});
		 

	}, 3000);
}

//load new content into the tweetNode
function reloadTweet(tweetNode){
	//using this.id to keep track of the underlying index to fetch data from json file
	this.id = this.id==undefined? 0 : this.id+1;
	var id = this.id % tweets.length; // in case id hits the last one
	var tweet = tweets[id];

	//initial calls should pass null values, in which case tweetNode will be initialized
	if(tweetNode == null) {
		//create tweet node using a hidden template
	    tweetNode = $("#tweet-template").clone();
		tweetNode.removeClass("template");
		tweetNode.attr("id", "tweet-"+(id+1));
	}
	
	//getting information from the tweet subarray
	var defaultURL = "./images/icon2.jpg";
	var imageURL = typeof(tweet["user"]["profile_image_url"]) == undefined? defaultURL: tweet["user"]["profile_image_url"];
	var tweetText = tweet["text"];

	//set user profile image, and bind an event in case of error
	tweetNode.children('img').each(function() {
		//replace to default image URL in case of error
		$(this).on("error", function(){
			$(this).attr("src", defaultURL);
			imageURL = defaultURL;
		});

		$(this).attr("src", imageURL);
	});

	//changing the inner html of the em child of this tweet node to user tweet message
	tweetNode.children('em').each(function() {
		$(this).html(tweetText);
	});

	//verify if this tweet has valid geo coordinates
	if (tweet["geo"] != null) {
		var lat = tweet["geo"]["coordinates"][0];
		var lng = tweet["geo"]["coordinates"][1];

		lng = parseFloat((lng).toFixed(5)); //google maps can't handle very long floats
		lat = parseFloat((lat).toFixed(5));

		//change background color to make this tweet seems special to users
		tweetNode.children('em').each(function(){
			$(this).addClass("bg-primary");
			tweetNode.on("click", function(){
				resetMarker(lat, lng, tweet, imageURL);
			});

		});
	}

	//after each loop, the detached tweet node should be appended to its parent again
	tweetNode.appendTo("#tweet-section");
	return tweetNode.attr("id");
}

function resetMarker(lat, lng, tweet, imageURL) {
	//marker is a global variable and will be removed from map upon each function call
	if (marker != undefined) {
		marker.setMap(null);	
	}

	//replace the marker's content with new information
	marker = new google.maps.Marker({
			      position: new google.maps.LatLng(lat, lng),
			      map: map,
			      title: tweet["user"]["name"],
			      icon: "./images/tweet.png",
			    });

	//upon function triggering, the map should center at the new marker's location
	map.panTo(marker.getPosition());

	//InfoWindow class can parse html strings, which makes this class much more powerful than it seems to be
	//user profile (image, name and description) will be displayed in the infowindow
	var contentSection = "<section class=\"panel col-xs-12\">"+
						 "<img src=\""+ imageURL +"\"  class=\"col-xs-5 col-xs-offset-3 img-circle\" >" +
						 "<section class=\"panel-heading text-center\" >" +
						 "<em class=\"tweet-text col-xs-12 panel panel-success\">"+ tweet["user"]["name"] +"</em>" +
						 "</section>"+ 
						 "<em class=\"text-center tweet-text col-xs-12 panel panel-danger\">"+ tweet["user"]["description"] +"</em>" +
						 "</section>";
		
	infowindow = new google.maps.InfoWindow({
      	content: contentSection
    });

    infowindow.open(map,marker);

}